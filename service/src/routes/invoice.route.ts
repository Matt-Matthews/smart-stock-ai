import express, { Router } from 'express';
import { createInvoiceOcr } from '@controllers/invoices/index.js';

const router: Router = express.Router();

router.post(
  '/ocr',
  express.raw({ type: ['application/pdf', 'image/*'], limit: '10mb' }),
  createInvoiceOcr
);

export default router;