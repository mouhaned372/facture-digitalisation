const Invoice = require('../models/Invoice');
const cron = require('node-cron');
const { Expo } = require('expo-server-sdk');

const expo = new Expo();

// Fonction pour envoyer des notifications push
const sendPushNotification = async (pushToken, title, body) => {
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Token push invalide: ${pushToken}`);
        return;
    }

    const message = {
        to: pushToken,
        sound: 'default',
        title,
        body,
        data: { withSome: 'data' },
    };

    try {
        const ticket = await expo.sendPushNotificationsAsync([message]);
        console.log('Notification envoyée:', ticket);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
    }
};

// Vérifie les factures en retard et envoie des notifications
const checkOverdueInvoices = async () => {
    try {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const invoices = await Invoice.find({
            paymentStatus: 'pending',
            dueDate: { $lt: todayStr }
        }).populate('createdBy');

        for (const invoice of invoices) {
            const hasNotification = invoice.notifications.some(
                n => n.type === 'payment_overdue'
            );

            if (!hasNotification) {
                invoice.notifications.push({
                    type: 'payment_overdue',
                    message: `Facture en retard depuis le ${invoice.dueDate}`
                });
                await invoice.save();

                console.log(`Notification créée pour la facture ${invoice.invoiceNumber}`);

                // Envoyer une notification push si l'utilisateur a un token
                if (invoice.createdBy && invoice.createdBy.expoPushToken) {
                    await sendPushNotification(
                        invoice.createdBy.expoPushToken,
                        'Facture en retard',
                        `La facture ${invoice.invoiceNumber} est en retard depuis le ${invoice.dueDate}`
                    );
                }
            }
        }
    } catch (error) {
        console.error('Erreur lors de la vérification des factures en retard:', error);
    }
};

// Planifier la vérification quotidienne à minuit
cron.schedule('0 0 * * *', checkOverdueInvoices);

module.exports = {
    checkOverdueInvoices,
    sendPushNotification
};