const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'La description est obligatoire']
    },
    quantity: {
        type: Number,
        required: [true, 'La quantité est obligatoire'],
        min: [1, 'La quantité doit être au moins 1']
    },
    unitPrice: {
        type: Number,
        required: [true, 'Le prix unitaire est obligatoire'],
        min: [0, 'Le prix ne peut pas être négatif']
    },
    totalPrice: {
        type: Number,
        required: [true, 'Le prix total est obligatoire'],
        min: [0, 'Le prix ne peut pas être négatif']
    }
}, { _id: false });

const SupplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom du fournisseur est obligatoire'],
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    taxId: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Email invalide']
    },
    phone: {
        type: String,
        trim: true
    }
}, { _id: false });

const NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['payment_reminder', 'payment_overdue'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    message: String
}, { _id: false });

const InvoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            unique: true,
            trim: true
        },
        invoiceDate: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^\d{2}\/\d{2}\/\d{4}$/.test(v);
                },
                message: props => `${props.value} n'est pas une date valide (format JJ/MM/AAAA)`
            }
        },
        dueDate: {
            type: String,
            validate: {
                validator: function(v) {
                    if (!v) return true;
                    return /^\d{2}\/\d{2}\/\d{4}$/.test(v);
                },
                message: props => `${props.value} n'est pas une date valide (format JJ/MM/AAAA)`
            }
        },
        paymentDate: {
            type: String,
            validate: {
                validator: function(v) {
                    if (!v) return true;
                    return /^\d{2}\/\d{2}\/\d{4}$/.test(v);
                },
                message: props => `${props.value} n'est pas une date valide (format JJ/MM/AAAA)`
            }
        },
        items: {
            type: [InvoiceItemSchema],
            required: [true, 'Au moins un article est obligatoire'],
            validate: {
                validator: function(v) {
                    return v.length > 0;
                },
                message: 'Au moins un article est obligatoire'
            }
        },
        subtotal: {
            type: Number,
            min: 0,
            required: true
        },
        taxAmount: {
            type: Number,
            min: 0,
            default: 0
        },
        totalAmount: {
            type: Number,
            min: 0,
            required: [true, 'Le montant total est obligatoire']
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'cancelled'],
            default: 'pending'
        },
        notifications: [NotificationSchema],
        extractedData: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Calcul automatique du sous-total et total avant sauvegarde
InvoiceSchema.pre('save', function(next) {
    if (this.isModified('items')) {
        this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
        this.totalAmount = this.subtotal + (this.taxAmount || 0);
    }
    next();
});

// Index pour les recherches fréquentes
InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ paymentStatus: 1 });
InvoiceSchema.index({ dueDate: 1 });
InvoiceSchema.index({ paymentDate: 1 });

// Méthode pour vérifier si une facture est en retard
InvoiceSchema.methods.isOverdue = function() {
    if (this.paymentStatus !== 'pending' || !this.dueDate) return false;

    const today = new Date();
    const dueDateParts = this.dueDate.split('/');
    const dueDate = new Date(`${dueDateParts[2]}-${dueDateParts[1]}-${dueDateParts[0]}`);

    return dueDate < today;
};

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;