const multer = require('multer');
const Invoice = require('../models/Invoice');
const { extractInvoiceData } = require('../services/geminiService');

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadInvoice = [
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Aucun fichier téléchargé' });
            }

            const imageBase64 = req.file.buffer.toString('base64');
            const extractedData = await extractInvoiceData(imageBase64);

            // Validation des données requises
            if (!extractedData.totalAmount) {
                throw new Error('Le montant total est requis');
            }

            const invoice = new Invoice({
                ...extractedData,
                totalAmount: extractedData.totalAmount || 0, // Valeur par défaut
                extractedData,
            });

            await invoice.save();

            res.status(201).json(invoice);
        } catch (error) {
            console.error('Erreur lors du traitement de la facture:', error);
            res.status(500).json({
                message: 'Erreur lors du traitement de la facture',
                error: error.message
            });
        }
    },
];

exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des factures' });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Facture non trouvée' });
        }
        res.json(invoice);
    } catch (error) {
        console.error('Erreur lors de la récupération de la facture:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la facture' });
    }
};