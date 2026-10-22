import type { Request, Response } from 'express';
import { processInvoiceOcr } from '@services/invoices/process-invoice-ocr.service.js';

const createInvoiceOcr = async (req: Request, res: Response) => {
  const companyId = String(req.headers['x-company-id'] || '');
  const userId = String(req.headers['x-user-id'] || '');
  const mimeType = String(req.headers['content-type'] || '');
  const originalName = String(req.headers['x-file-name'] || `invoice-${Date.now()}`);

  if (!companyId || !userId || !Buffer.isBuffer(req.body)) {
    return res.status(400).json({
      status: 'error',
      message: 'x-company-id, x-user-id, and a PDF or image body are required.'
    });
  }

  try {
    const result = await processInvoiceOcr({
      companyId,
      userId,
      fileBuffer: req.body,
      mimeType,
      originalName,
    });

    return res.status(result.statusCode || 500).json({
      status: result.status,
      message: result.message,
      data: result.data ?? null,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Failed to process invoice OCR.',
      data: null,
    });
  }
};

export default createInvoiceOcr;
