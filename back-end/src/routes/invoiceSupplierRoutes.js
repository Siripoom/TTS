import express from 'express';
import { getInvoiceSupplier, getInvoiceSupplierById , createInvoiceSupplier, updateInvoiceSupplier, deleteInvoiceSupplier } from '../controllers/invoiceSupplierController.js';

const router = express.Router();

router.get('/', getInvoiceSupplier);
router.post('/', createInvoiceSupplier);
router.put('/:id', updateInvoiceSupplier);
router.delete('/:id', deleteInvoiceSupplier);
router.get('/:id', getInvoiceSupplierById);

export default router;