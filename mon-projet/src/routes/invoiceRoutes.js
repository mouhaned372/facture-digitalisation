const express = require('express');
const {
    uploadInvoice,
    getAllInvoices,
    getInvoiceById,
} = require('../controllers/invoiceController');

const router = express.Router();

router.post('/upload', ...uploadInvoice);
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);

module.exports = router;