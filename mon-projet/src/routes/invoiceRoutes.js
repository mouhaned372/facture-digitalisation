const express = require('express');
const {
    uploadInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
    createManualInvoice, // Fixed typo and added comma
    getOverdueInvoices
} = require('../controllers/invoiceController');

const router = express.Router();

router.post('/upload', uploadInvoice); // Removed spread operator unless uploadInvoice is an array
router.post('/manual', createManualInvoice);
router.get('/', getAllInvoices);
router.get('/overdue', getOverdueInvoices);
router.get('/:id', getInvoiceById);
router.put('/:id', updateInvoice);
router.put('/:id/mark-as-paid', markAsPaid);
router.delete('/:id', deleteInvoice);

const User = require('../models/User');
router.post('/:userId/push-token', async (req, res) => {
    try {
        const { userId } = req.params;
        const { expoPushToken } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { expoPushToken },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json(user);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du token push:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;