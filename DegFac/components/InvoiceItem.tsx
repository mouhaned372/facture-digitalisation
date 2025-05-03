import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Invoice } from '@/types/invoice';

interface InvoiceItemProps {
    invoice: Invoice;
    onPress: () => void;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({ invoice, onPress }) => {
    // Validation robuste des données
    if (!invoice || typeof invoice.totalAmount === 'undefined') {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Données de facture incomplètes</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.invoiceNumber}>
                    {invoice.invoiceNumber || 'N° Non disponible'}
                </Text>
                <Text style={styles.totalAmount}>
                    {invoice.totalAmount?.toFixed(2)} €
                </Text>
            </View>

            <Text style={styles.supplier}>
                {invoice.supplier?.name || 'Fournisseur inconnu'}
            </Text>

            <View style={styles.details}>
                <Text>{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : 'Date inconnue'}</Text>
                <Text style={styles[invoice.paymentStatus || 'pending']}>
                    {invoice.paymentStatus === 'paid' ? 'Payée' : 'En attente'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    invoiceNumber: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    totalAmount: {
        fontWeight: 'bold',
        color: '#2e86de',
        fontSize: 16,
    },
    supplier: {
        marginBottom: 8,
        color: '#555',
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pending: {
        color: '#e67e22',
    },
    paid: {
        color: '#27ae60',
    },
    cancelled: {
        color: '#e74c3c',
    },
    errorText: {
        color: 'red',
        fontStyle: 'italic',
    },
});

export default InvoiceItem;