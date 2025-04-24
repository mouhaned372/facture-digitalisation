const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    extractedData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['facture', 'devis', 'bon de commande', 'autre'],
        default: 'facture'
    },
    amount: {
        type: Number
    },
    vendor: {
        type: String
    }
}, {
    timestamps: true
});

// Index pour les recherches fréquentes
invoiceSchema.index({ userId: 1, date: -1 });
invoiceSchema.index({ userId: 1, type: 1 });
invoiceSchema.index({ userId: 1, amount: 1 });
invoiceSchema.index({ userId: 1, vendor: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);