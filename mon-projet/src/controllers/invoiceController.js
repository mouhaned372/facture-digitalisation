const Invoice = require('../models/Invoice');
const { processDocument } = require('../services/geminiService');

exports.uploadInvoice = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Traitement du document avec Gemini
        const extractedData = await processDocument(req.file);

        // Création de la facture dans la base de données
        const invoice = new Invoice({
            userId: req.userId, // À partir du middleware d'authentification
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            filePath: req.file.path,
            extractedData,
            type: extractedData.type || 'facture',
            amount: extractedData.totalAmount || 0,
            vendor: extractedData.vendor || 'Inconnu'
        });

        await invoice.save();

        res.status(201).json({
            message: 'Invoice processed successfully',
            invoice
        });
    } catch (error) {
        console.error('Error uploading invoice:', error);
        res.status(500).json({ message: 'Error processing invoice', error: error.message });
    }
};

exports.getAllInvoices = async (req, res) => {
    try {
        const { sortBy, type, startDate, endDate, minAmount, maxAmount } = req.query;
        const userId = req.userId;

        let query = { userId };

        // Filtres
        if (type) query.type = type;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = Number(minAmount);
            if (maxAmount) query.amount.$lte = Number(maxAmount);
        }

        // Tri
        let sortOptions = { date: -1 }; // Par défaut: plus récent d'abord
        if (sortBy === 'date_asc') sortOptions = { date: 1 };
        if (sortBy === 'amount_desc') sortOptions = { amount: -1 };
        if (sortBy === 'amount_asc') sortOptions = { amount: 1 };
        if (sortBy === 'type') sortOptions = { type: 1 };

        const invoices = await Invoice.find(query).sort(sortOptions);

        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: 'Error fetching invoices', error: error.message });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ message: 'Error fetching invoice', error: error.message });
    }
};