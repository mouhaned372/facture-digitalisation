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

            let extractedData = await extractInvoiceData(
                req.file.buffer,
                req.file.mimetype
            );

            let counter = 1;
            let originalNumber = extractedData.invoiceNumber;

            while (await Invoice.exists({ invoiceNumber: extractedData.invoiceNumber })) {
                extractedData.invoiceNumber = `${originalNumber}-${counter++}`;
            }

            const invoice = new Invoice({
                ...extractedData,
                totalAmount: extractedData.totalAmount || 0,
                paymentStatus: 'pending',
                paymentDate: null,
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

exports.updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const invoice = await Invoice.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Facture non trouvée' });
        }

        res.json(invoice);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la facture:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la facture' });
    }
};

exports.deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findByIdAndDelete(id);

        if (!invoice) {
            return res.status(404).json({ message: 'Facture non trouvée' });
        }

        res.json({ message: 'Facture supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la facture:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la facture' });
    }
};

exports.markAsPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentDate } = req.body;

        const updateData = {
            paymentStatus: 'paid',
            paymentDate: paymentDate || new Date().toISOString().split('T')[0]
        };

        const invoice = await Invoice.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Facture non trouvée' });
        }

        res.json(invoice);
    } catch (error) {
        console.error('Erreur lors du marquage comme payée:', error);
        res.status(500).json({ message: 'Erreur lors du marquage comme payée' });
    }
};

exports.getOverdueInvoices = async (req, res) => {
    try {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const invoices = await Invoice.find({
            paymentStatus: 'pending',
            dueDate: { $lt: todayStr }
        });

        res.json(invoices);
    } catch (error) {
        console.error('Erreur lors de la récupération des factures en retard:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des factures en retard' });
    }
};
exports.createManualInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            invoiceDate,
            supplier,
            items,
            subtotal,
            taxAmount,
            totalAmount,
            paymentStatus = 'pending'
        } = req.body;

        // Vérifier si le numéro de facture existe déjà
        let counter = 1;
        let originalNumber = invoiceNumber;
        let finalInvoiceNumber = invoiceNumber;

        while (await Invoice.exists({ invoiceNumber: finalInvoiceNumber })) {
            finalInvoiceNumber = `${originalNumber}-${counter++}`;
        }

        const invoice = new Invoice({
            invoiceNumber: finalInvoiceNumber,
            invoiceDate,
            supplier,
            items,
            subtotal: subtotal || 0,
            taxAmount: taxAmount || 0,
            totalAmount: totalAmount || 0,
            paymentStatus,
            isManualEntry: true,
            extractedData: req.body
        });

        await invoice.save();

        res.status(201).json(invoice);
    } catch (error) {
        console.error('Erreur lors de la création manuelle de facture:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de la facture',
            error: error.message
        });
    }
};