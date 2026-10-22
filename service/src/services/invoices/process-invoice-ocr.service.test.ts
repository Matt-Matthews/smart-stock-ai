import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { normalizeInvoiceExtraction, normalizeProductEntry } from './process-invoice-ocr.service.js';

describe('invoice OCR normalization', () => {
  it('extracts supplier and product lines from mixed OCR text', () => {
    const payload = {
      supplier: 'ACME SUPPLIES LTD',
      items: [
        { name: 'Organic Rice 1kg', quantity: '3', unit_price: '$12.50' },
        { name: 'Tomato Paste 500g', quantity: 2, unit_price: 8.25 }
      ]
    };

    const result = normalizeInvoiceExtraction(payload as any);

    assert.equal(result.supplierName, 'ACME SUPPLIES LTD');
    assert.equal(result.products.length, 2);
    assert.equal(result.products[0].name, 'Organic Rice 1kg');
    assert.equal(result.products[0].quantity, 3);
  });

  it('normalizes fuzzy product names and quantities into stable data', () => {
    const product = normalizeProductEntry({
      name: '  tomato paste 500g  ',
      quantity: '  2 pcs ',
      price: '8.25'
    });

    assert.equal(product.name, 'Tomato Paste 500g');
    assert.equal(product.quantity, 2);
    assert.equal(product.price, 8.25);
  });
});
