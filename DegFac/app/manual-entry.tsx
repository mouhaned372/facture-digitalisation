import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export default function ManualEntryScreen() {
    const router = useRouter();

    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [supplierAddress, setSupplierAddress] = useState('');
    const [supplierTaxId, setSupplierTaxId] = useState('');
    const [items, setItems] = useState([{ description: '', quantity: '1', unitPrice: '0' }]);

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: '1', unitPrice: '0' }]);
    };

    const handleChangeItem = (index: number, field: string, value: string) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const handleSubmit = () => {
        const parsedItems = items.map(item => ({
            ...item,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice),
        }));

        const totalAmount = parsedItems.reduce((acc, item) => acc + item.totalPrice, 0);

        const newInvoice = {
            invoiceNumber,
            invoiceDate,
            supplier: {
                name: supplierName,
                address: supplierAddress,
                taxId: supplierTaxId,
            },
            items: parsedItems,
            totalAmount,
            paymentStatus: 'pending',
            createdAt: new Date().toISOString(),
        };

        // TODO: envoyer au backend
        Alert.alert('Facture ajoutée', `Total: ${totalAmount.toFixed(2)} DT`);

        router.back(); // ou router.push('/invoices');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>Saisie Manuelle</Text>

            {/* Informations générales */}
            <View style={styles.section}>
                <Text style={styles.label}>N° Facture</Text>
                <TextInput
                    value={invoiceNumber}
                    onChangeText={setInvoiceNumber}
                    placeholder="ex: 2024-001"
                    style={styles.input}
                />
                <Text style={styles.label}>Date</Text>
                <TextInput
                    value={invoiceDate}
                    onChangeText={setInvoiceDate}
                    placeholder="ex: 11/05/2025"
                    style={styles.input}
                />
            </View>

            {/* Fournisseur */}
            <View style={styles.section}>
                <Text style={styles.label}>Nom du Fournisseur</Text>
                <TextInput
                    value={supplierName}
                    onChangeText={setSupplierName}
                    placeholder="ex: Société ABC"
                    style={styles.input}
                />
                <Text style={styles.label}>Adresse</Text>
                <TextInput
                    value={supplierAddress}
                    onChangeText={setSupplierAddress}
                    placeholder="ex: Rue 123, Tunis"
                    multiline
                    style={[styles.input, { height: 60 }]}
                />
                <Text style={styles.label}>Identifiant fiscal</Text>
                <TextInput
                    value={supplierTaxId}
                    onChangeText={setSupplierTaxId}
                    placeholder="ex: 012345678"
                    style={styles.input}
                />
            </View>

            {/* Articles */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Articles</Text>
                {items.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                        <TextInput
                            value={item.description}
                            onChangeText={value => handleChangeItem(index, 'description', value)}
                            placeholder="Description"
                            style={[styles.input, { flex: 3 }]}
                        />
                        <TextInput
                            value={item.quantity}
                            onChangeText={value => handleChangeItem(index, 'quantity', value)}
                            keyboardType="numeric"
                            placeholder="Qté"
                            style={[styles.input, { flex: 1, marginHorizontal: 4 }]}
                        />
                        <TextInput
                            value={item.unitPrice}
                            onChangeText={value => handleChangeItem(index, 'unitPrice', value)}
                            keyboardType="numeric"
                            placeholder="Prix U"
                            style={[styles.input, { flex: 2 }]}
                        />
                    </View>
                ))}
                <TouchableOpacity style={styles.addItemBtn} onPress={handleAddItem}>
                    <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
                    <Text style={styles.addItemText}>Ajouter un article</Text>
                </TouchableOpacity>
            </View>

            {/* Soumettre */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Enregistrer la facture</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 20,
    },
    title: {
        ...theme.text.h2,
        marginBottom: 16,
        color: theme.colors.text,
        fontWeight: '700',
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    label: {
        ...theme.text.caption,
        color: theme.colors.textSecondary,
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        padding: 10,
        marginBottom: 12,
        backgroundColor: theme.colors.card,
        color: theme.colors.text,
    },
    sectionTitle: {
        ...theme.text.h4,
        color: theme.colors.text,
        marginBottom: 8,
        fontWeight: '600',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    addItemBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    addItemText: {
        marginLeft: 6,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    submitBtn: {
        backgroundColor: theme.colors.primary,
        padding: 14,
        borderRadius: theme.radius.lg,
        alignItems: 'center',
        marginTop: 24,
    },
    submitText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});
