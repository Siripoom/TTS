import express from 'express';
import {} from '../controllers/invoiceSupplierController.js';
import { createInvoiceCustomerItem, deleteInvoiceCustomerItem, getInvoiceCustomerItem, getInvoiceCustomerItemById, updateInvoiceCustomerItem } from '../controllers/invoiceCustomerItemController.js';

const router = express.Router();

// Get all invoice suppliers
router.get('/', getInvoiceCustomerItem);
// Create a new invoice supplier
router.post('/', createInvoiceCustomerItem);
// Update an existing invoice supplier
router.put('/:id', updateInvoiceCustomerItem);
// Delete an invoice supplier
router.delete('/:id', deleteInvoiceCustomerItem);
// Get an invoice supplier by ID
router.get('/:id', getInvoiceCustomerItemById);

export default router;