const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Upload d'une facture
router.post('/', auth, upload.single('file'), invoiceController.uploadInvoice);

// Récupérer toutes les factures avec filtres
router.get('/', auth, invoiceController.getAllInvoices);

// Récupérer une facture spécifique
router.get('/:id', auth, invoiceController.getInvoiceById);

module.exports = router;