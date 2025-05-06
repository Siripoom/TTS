import express from 'express';
import { getInvoiceSupplier, getInvoiceSupplierById , createInvoiceSupplier, updateInvoiceSupplier, deleteInvoiceSupplier } from '../controllers/invoiceSupplier.js';

const router = express.Router();

// Get all invoice suppliers
router.get('/', getInvoiceSupplier);
// Create a new invoice supplier
router.post('/', createInvoiceSupplier);
// Update an existing invoice supplier
router.put('/:id', updateInvoiceSupplier);
// Delete an invoice supplier
router.delete('/:id', deleteInvoiceSupplier);
// Get an invoice supplier by ID
router.get('/:id', getInvoiceSupplierById);

export default router;