import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { v7 as uuid } from 'uuid';
import OpenAI from 'openai';
import { Prisma } from '@configs/generated/prisma/client.js';
import { prisma } from '@configs/mysql-db.config.js';
import { serviceResult } from '@utils/request-result.util.js';
import type { IServiceResult } from '@typeDefs/request-result.type.js';

export interface IInvoiceProductCandidate {
  name: string;
  quantity: number;
  price: number;
}

export interface IInvoiceExtraction {
  supplierName: string;
  products: IInvoiceProductCandidate[];
}

export interface IProcessInvoiceOcrInput {
  companyId: string;
  userId: string;
  fileBuffer: Buffer;
  mimeType: string;
  originalName: string;
}

const getOpenAiClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  return new OpenAI({ apiKey });
};

const sanitizeFileName = (fileName: string) =>
  fileName.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || `invoice-${Date.now()}`;

const normalizeCurrencyCode = (value?: string) => {
  const code = String(value ?? 'USD').trim().toUpperCase();
  return code || 'USD';
};

export const normalizeProductEntry = (rawProduct: any): IInvoiceProductCandidate => {
  const name = String(rawProduct?.name ?? rawProduct?.product_name ?? rawProduct?.item_name ?? '').trim();
  const quantityRaw = rawProduct?.quantity ?? rawProduct?.qty ?? rawProduct?.count ?? rawProduct?.units ?? 1;
  const priceRaw = rawProduct?.unit_price ?? rawProduct?.price ?? rawProduct?.unitPrice ?? rawProduct?.amount ?? 0;

  const cleanedName = name
    .replace(/\s+/g, ' ')
    .replace(/\b(\d+\s*(?:pcs|pc|qty|units?))\b/gi, '')
    .replace(/\s*[:;-]+\s*$/g, '')
    .trim();

  const quantity = Number(String(quantityRaw).replace(/[^0-9.\-]/g, '')) || 1;
  const price = Number(String(priceRaw).replace(/[$,\s]/g, '')) || 0;

  return {
    name: cleanedName || 'Unknown product',
    quantity: Number.isFinite(quantity) ? Math.max(1, Math.round(quantity)) : 1,
    price: Number.isFinite(price) ? Number(price.toFixed(2)) : 0,
  };
};

export const normalizeInvoiceExtraction = (rawExtraction: any): IInvoiceExtraction => {
  const supplierName = String(
    rawExtraction?.supplier ?? rawExtraction?.supplier_name ?? rawExtraction?.supplierName ?? rawExtraction?.vendor ?? ''
  ).replace(/\s+/g, ' ').trim();

  const candidates = Array.isArray(rawExtraction?.products)
    ? rawExtraction.products
    : Array.isArray(rawExtraction?.items)
      ? rawExtraction.items
      : Array.isArray(rawExtraction?.line_items)
        ? rawExtraction.line_items
        : [];

  const products = candidates
    .map((product: any) => normalizeProductEntry(product))
    .filter((product: IInvoiceProductCandidate) => product.name && product.name !== 'Unknown product');

  return {
    supplierName: supplierName || 'Unknown supplier',
    products,
  };
};

const parseOpenAiResponseText = (content: string) => {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }

    return null;
  }
};

const scanInvoiceWithOpenAi = async (fileBuffer: Buffer, mimeType: string, originalName: string): Promise<IInvoiceExtraction> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured. Please add it to your environment before scanning invoices.');
  }

  const client = getOpenAiClient();
  const prompt = [
    'You are extracting invoice data for stock management.',
    'Return valid JSON only with this structure: {"supplier": "supplier name", "products": [{"name":"product name","quantity": 2,"unit_price": 12.5}] }',
    'Use the product names exactly as they appear in the invoice. Prefer short clean names. If the supplier or product is unknown, still include the best match from the invoice.',
    'If the invoice has no product list, return {"supplier": "best possible supplier name", "products": []}.',
    'Do not add extra text or markdown fences.'
  ].join(' ');

  let responseText = '';

  if (mimeType.includes('image/')) {
    const imageUrl = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_OCR_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
    });

    responseText = String(completion.choices[0]?.message?.content ?? '');
  } else {
    const base64Data = fileBuffer.toString('base64');
    const payload = {
      model: process.env.OPENAI_OCR_MODEL || 'gpt-4o-mini',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            {
              type: 'input_file',
              filename: originalName || 'invoice.pdf',
              file_data: `data:${mimeType || 'application/pdf'};base64,${base64Data}`,
            },
          ],
        },
      ],
    } as any;

    const completion = await client.responses.create(payload);
    responseText = String(completion.output_text ?? (completion as any).output?.map((entry: any) => entry?.content?.map((item: any) => item?.text || '').join(' ') || '').join(' ') ?? '');
  }

  const parsed = parseOpenAiResponseText(responseText) ?? normalizeInvoiceExtraction({});
  const normalized = normalizeInvoiceExtraction(parsed);

  if (!normalized.products.length && !normalized.supplierName) {
    throw new Error('OCR extraction did not return usable invoice data.');
  }

  return normalized;
};

const saveFilePlaceholder = async (fileBuffer: Buffer, originalName: string, companyId: string, userId: string) => {
  const id = uuid();
  const uploadDirectory = path.resolve(process.env.UPLOAD_DIRECTORY || './uploads/invoices');
  const safeFileName = sanitizeFileName(originalName || `invoice-${Date.now()}`);
  const storagePath = path.join(uploadDirectory, `${id}-${safeFileName}`);

  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(storagePath, fileBuffer);

  return {
    id,
    companyId,
    userId,
    storagePath,
    originalName: safeFileName,
  };
};

const ensureDefaultCurrency = async () => {
  const normalizedCode = normalizeCurrencyCode(process.env.DEFAULT_CURRENCY_CODE || 'USD');

  let currency = await prisma.currency.findFirst({
    where: {
      code: normalizedCode,
    },
  });

  if (!currency) {
    currency = await prisma.currency.create({
      data: {
        code: normalizedCode,
        name: normalizedCode === 'USD' ? 'US Dollar' : normalizedCode,
      },
    });
  }

  return currency;
};

const ensureDefaultCategory = async (companyId: string) => {
  let category = await prisma.category.findFirst({
    where: {
      company_id: companyId,
      name: {
        equals: 'General',
        mode: 'insensitive',
      },
    },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        company_id: companyId,
        name: 'General',
        description: 'Automatically created for imported invoice items.',
      },
    });
  }

  return category;
};

const findOrCreateSupplier = async (companyId: string, supplierName: string) => {
  const name = supplierName.trim();
  if (!name) {
    throw new Error('Supplier name is required for invoice processing.');
  }

  const existingSupplier = await prisma.suppliers.findFirst({
    where: {
      company_id: companyId,
      name: {
        contains: name,
        mode: 'insensitive',
      },
    },
  });

  if (existingSupplier) {
    return existingSupplier;
  }

  return prisma.suppliers.create({
    data: {
      company_id: companyId,
      name,
      description: `Created automatically from OCR invoice import.`,
    },
  });
};

const findOrCreateItemForProduct = async (companyId: string, productName: string) => {
  const name = productName.trim();
  if (!name) {
    throw new Error('Product name is required for invoice processing.');
  }

  const existingItem = await prisma.item.findFirst({
    where: {
      company_id: companyId,
      OR: [
        { name: { contains: name, mode: 'insensitive' } },
        { sku: { contains: name, mode: 'insensitive' } },
        { barcode: { contains: name, mode: 'insensitive' } },
      ],
    },
  });

  if (existingItem) {
    return existingItem;
  }

  const [currency, category] = await Promise.all([
    ensureDefaultCurrency(),
    ensureDefaultCategory(companyId),
  ]);

  return prisma.item.create({
    data: {
      company_id: companyId,
      category_id: category.id,
      currency_id: currency.id,
      name,
      description: 'Created automatically from OCR invoice import.',
      cost_price: 0,
      sell_price: 0,
      sku: `ocr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    },
  });
};

const createInvoiceImport = async ({ companyId, userId, fileBuffer, mimeType, originalName }: IProcessInvoiceOcrInput) => {
  const fileRecord = await saveFilePlaceholder(fileBuffer, originalName, companyId, userId);
  const document = await prisma.ocrDocument.create({
    data: {
      id: fileRecord.id,
      company_id: companyId,
      user_id: userId,
      original_name: fileRecord.originalName,
      mime_type: mimeType || 'application/octet-stream',
      storage_path: fileRecord.storagePath,
      status: 'processing',
    },
  });

  const extraction = await scanInvoiceWithOpenAi(fileBuffer, mimeType, originalName);

  const supplier = await findOrCreateSupplier(companyId, extraction.supplierName);
  const invoiceAmount = extraction.products.reduce((sum, product) => sum + product.quantity * product.price, 0);
  const vatAmount = Number((invoiceAmount * 0.15).toFixed(2));
  const total = Number((invoiceAmount + vatAmount).toFixed(2));

  const invoice = await prisma.invoices.create({
    data: {
      company_id: companyId,
      supplier_id: supplier.id,
      amount: invoiceAmount,
      vat: vatAmount,
      total,
    },
  });

  const invoiceProducts = await Promise.all(
    extraction.products.map(async (product) => {
      const item = await findOrCreateItemForProduct(companyId, product.name);
      const inventory = await prisma.inventory.upsert({
        where: { item_id: item.id },
        update: {
          quantity: { increment: product.quantity },
          status: 'in_stock',
          company_id: companyId,
        },
        create: {
          item_id: item.id,
          quantity: product.quantity,
          status: 'in_stock',
          company_id: companyId,
        },
      });

      await prisma.invoice_items.create({
        data: {
          invoice_id: invoice.id,
          item_id: item.id,
          quantity: product.quantity,
          price: product.price,
        },
      });

      return { item, inventory, product };
    })
  );

  const extractionJson: Prisma.InputJsonValue = {
    supplierName: extraction.supplierName,
    products: extraction.products.map((product) => ({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    })),
  };

  await prisma.ocrDocument.update({
    where: { id: document.id },
    data: {
      status: 'completed',
      extracted_data: extractionJson,
      error_message: null,
    },
  });

  await prisma.notification.create({
    data: {
      user_id: userId,
      company_id: companyId,
      title: 'Invoice OCR imported',
      message: `${supplier.name} invoice was imported successfully with ${invoiceProducts.length} product(s).`,
      type: 'info',
    },
  });

  return {
    document,
    invoice,
    supplier,
    extractedData: extraction,
    products: invoiceProducts,
  };
};

export const processInvoiceOcr = async ({ companyId, userId, fileBuffer, mimeType, originalName }: IProcessInvoiceOcrInput): Promise<IServiceResult<any>> => {
  try {
    if (!companyId || !userId) {
      return serviceResult(400, 'error', 'x-company-id and x-user-id are required.', null);
    }

    if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
      return serviceResult(400, 'error', 'Invoice file content is required.', null);
    }

    const result = await createInvoiceImport({
      companyId,
      userId,
      fileBuffer,
      mimeType,
      originalName,
    });

    return serviceResult(201, 'success', 'Invoice OCR processed successfully.', result);
  } catch (error: any) {
    return serviceResult(500, 'error', error?.message || 'Failed to process invoice OCR.', null, error);
  }
};

export default processInvoiceOcr;
