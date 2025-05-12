import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { API_URL } from '@/constants/config';

export default function ManualEntryScreen() {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [supplierAddress, setSupplierAddress] = useState('');
    const [supplierTaxId, setSupplierTaxId] = useState('');
    const [items, setItems] = useState([{ description: '', quantity: '1', unitPrice: '0', total: '0' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: '1', unitPrice: '0', total: '0' }]);
    };

    const handleRemoveItem = (index: number) => {
        if (items.length > 1) {
            const updatedItems = [...items];
            updatedItems.splice(index, 1);
            setItems(updatedItems);
        }
    };

    const handleChangeItem = (index: number, field: string, value: string) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;

        if (field === 'quantity' || field === 'unitPrice') {
            const quantity = parseFloat(updatedItems[index].quantity) || 0;
            const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
            updatedItems[index].total = (quantity * unitPrice).toFixed(2);
        }

        setItems(updatedItems);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = async () => {
        // Validation des champs obligatoires
        if (!invoiceNumber || !supplierName || items.some(item => !item.description)) {
            Alert.alert('Champs manquants', 'Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Validation des nombres
        if (items.some(item => isNaN(parseFloat(item.quantity)) || isNaN(parseFloat(item.unitPrice)))) {
            Alert.alert('Valeurs incorrectes', 'Les quantités et prix doivent être des nombres valides');
            return;
        }

        setIsSubmitting(true);

        const parsedItems = items.map(item => ({
            description: item.description,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            totalPrice: parseFloat(item.total),
        }));

        const subtotal = parsedItems.reduce((acc, item) => acc + item.totalPrice, 0);
        const taxAmount = subtotal * 0.19; // 19% de TVA
        const totalAmount = subtotal + taxAmount;

        const newInvoice = {
            invoiceNumber,
            invoiceDate: formatDate(date),
            supplier: {
                name: supplierName,
                address: supplierAddress,
                taxId: supplierTaxId,
            },
            items: parsedItems,
            subtotal,
            taxAmount,
            totalAmount,
            paymentStatus: 'pending',
            isManualEntry: true,
        };

        try {
            const response = await axios.post(`${API_URL}/invoices/manual`, newInvoice, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            Alert.alert('Succès', `Facture ${response.data.invoiceNumber} enregistrée avec succès`);
            router.push({
                pathname: '/modal',
                params: { invoice: JSON.stringify(response.data) }
            });
        } catch (error) {
            console.error('Erreur API:', error);

            let errorMessage = "Une erreur s'est produite lors de l'enregistrement";
            if (error.response) {
                if (error.response.status === 404) {
                    errorMessage = "Le serveur n'a pas trouvé la ressource demandée";
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                errorMessage = "Pas de réponse du serveur - vérifiez votre connexion";
            }

            Alert.alert('Erreur', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Nouvelle Facture</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Carte Informations de base */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Informations de base</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Numéro de facture *</Text>
                        <TextInput
                            value={invoiceNumber}
                            onChangeText={setInvoiceNumber}
                            placeholder="FAC-2024-001"
                            style={styles.input}
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date de facturation *</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateText}>{formatDate(date)}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                    </View>
                </View>

                {/* Carte Fournisseur */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Fournisseur</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nom du fournisseur *</Text>
                        <TextInput
                            value={supplierName}
                            onChangeText={setSupplierName}
                            placeholder="Nom du fournisseur"
                            style={styles.input}
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Adresse</Text>
                        <TextInput
                            value={supplierAddress}
                            onChangeText={setSupplierAddress}
                            placeholder="Adresse complète"
                            multiline
                            style={[styles.input, styles.multilineInput]}
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Identifiant fiscal</Text>
                        <TextInput
                            value={supplierTaxId}
                            onChangeText={setSupplierTaxId}
                            placeholder="Numéro d'identification"
                            style={styles.input}
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>
                </View>

                {/* Carte Articles */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Articles</Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddItem}
                        >
                            <Ionicons name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {items.map((item, index) => (
                        <View key={index} style={styles.itemCard}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemNumber}>Article {index + 1}</Text>
                                {items.length > 1 && (
                                    <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                                        <MaterialIcons
                                            name="delete-outline"
                                            size={20}
                                            color={theme.colors.danger}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Description *</Text>
                                <TextInput
                                    value={item.description}
                                    onChangeText={value => handleChangeItem(index, 'description', value)}
                                    placeholder="Description de l'article"
                                    style={styles.input}
                                    placeholderTextColor={theme.colors.textSecondary}
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.label}>Quantité</Text>
                                    <TextInput
                                        value={item.quantity}
                                        onChangeText={value => handleChangeItem(index, 'quantity', value)}
                                        keyboardType="numeric"
                                        style={styles.input}
                                        placeholderTextColor={theme.colors.textSecondary}
                                    />
                                </View>

                                <View style={[styles.inputGroup, { flex: 1, marginHorizontal: 8 }]}>
                                    <Text style={styles.label}>Prix unitaire (DT)</Text>
                                    <TextInput
                                        value={item.unitPrice}
                                        onChangeText={value => handleChangeItem(index, 'unitPrice', value)}
                                        keyboardType="numeric"
                                        style={styles.input}
                                        placeholderTextColor={theme.colors.textSecondary}
                                    />
                                </View>

                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                    <Text style={styles.label}>Total (DT)</Text>
                                    <TextInput
                                        value={item.total}
                                        editable={false}
                                        style={[styles.input, styles.disabledInput]}
                                        placeholderTextColor={theme.colors.textSecondary}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Bouton de soumission */}
                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>
                            Enregistrer la facture
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.text,
    },
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: theme.colors.text,
    },
    disabledInput: {
        backgroundColor: theme.colors.borderLight,
        color: theme.colors.textSecondary,
    },
    multilineInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    dateText: {
        fontSize: 16,
        color: theme.colors.text,
        paddingVertical: 12,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemCard: {
        backgroundColor: theme.colors.background,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});