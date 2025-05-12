const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // ... autres champs existants
    expoPushToken: {
        type: String,
        unique: true,
        sparse: true
    },
    notificationPreferences: {
        paymentReminders: {
            type: Boolean,
            default: true
        },
        overdueInvoices: {
            type: Boolean,
            default: true
        }
    }
});

module.exports = mongoose.model('User', UserSchema);