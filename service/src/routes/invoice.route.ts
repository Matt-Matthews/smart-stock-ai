import express, { Router } from 'express';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { v7 as uuid } from 'uuid';
import { prisma } from '@configs/mysql-db.config.js';

const router: Router = express.Router();

router.post('/ocr', express.raw({ type: ['application/pdf', 'image/*'], limit: '10mb' }), async (req, res) => {
    const companyId = String(req.headers['x-company-id'] || '');
    const userId = String(req.headers['x-user-id'] || '');
    const mimeType = String(req.headers['content-type'] || '');
    const originalName = String(req.headers['x-file-name'] || `invoice-${Date.now()}`);

    if (!companyId || !userId || !Buffer.isBuffer(req.body)) {
        return res.status(400).json({ status: 'error', message: 'x-company-id, x-user-id, and a PDF or image body are required.' });
    }

    const id = uuid();
    const uploadDirectory = path.resolve(process.env.UPLOAD_DIRECTORY || './uploads/invoices');
    const storagePath = path.join(uploadDirectory, `${id}-${path.basename(originalName)}`);
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(storagePath, req.body);

    const ocrDocument = await (prisma as any).ocrDocument.create({ data: { id, company_id: companyId, user_id: userId, original_name: originalName, mime_type: mimeType, storage_path: storagePath, status: 'processing' } });
    let status = 'pending';
    let extractedData: unknown = null;
    let errorMessage: string | null = null;

    if (process.env.OCR_SERVICE_URL) {
        try {
            const body = req.body.buffer.slice(req.body.byteOffset, req.body.byteOffset + req.body.byteLength) as ArrayBuffer;
            const response = await fetch(process.env.OCR_SERVICE_URL, { method: 'POST', headers: { 'content-type': mimeType, 'x-file-name': originalName }, body });
            if (!response.ok) throw new Error(`OCR provider returned ${response.status}`);
            extractedData = await response.json();
            status = 'completed';
        } catch (error: any) {
            status = 'failed';
            errorMessage = error.message;
        }
    }

    const updatedDocument = await (prisma as any).ocrDocument.update({ where: { id }, data: { status, extracted_data: extractedData, error_message: errorMessage } });
    await (prisma as any).notification.create({ data: { user_id: userId, company_id: companyId, title: status === 'completed' ? 'Invoice OCR completed' : 'Invoice OCR submitted', message: status === 'completed' ? `${originalName} was processed successfully.` : `${originalName} is queued for OCR processing.`, type: status === 'failed' ? 'error' : 'info' } });
    return res.status(201).json({ status: 'success', data: updatedDocument });
});

export default router;