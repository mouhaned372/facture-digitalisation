import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Invoice } from '@/types/invoice';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function InvoiceModal() {
    const { invoice } = useLocalSearchParams();
    const router = useRouter();
    const [invoiceData, setInvoiceData] = useState<Invoice>(JSON.parse(invoice as string));
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({ ...invoiceData });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateField, setDateField] = useState('');

    const getSupplier = () => {
        return invoiceData.supplier || invoiceData.extractedData?.supplier || {
            name: 'Fournisseur inconnu',
            address: null,
            taxId: null
        };
    };

    const getItems = () => {
        return (invoiceData.items || invoiceData.extractedData?.items || []).map(item => ({
            description: item.description || 'Article non spécifié',
            quantity: item.quantity ?? 1,
            unitPrice: item.unitPrice ?? 0,
            totalPrice: item.totalPrice ?? (item.unitPrice ?? 0) * (item.quantity ?? 1)
        }));
    };

    const formatDate = (dateInput) => {
        if (!dateInput) return 'Non spécifié';

        if (typeof dateInput === 'string' && dateInput.includes('/')) {
            const [day, month, year] = dateInput.split('/');
            return new Date(`${year}-${month}-${day}`).toLocaleDateString('fr-FR');
        }

        return new Date(dateInput).toLocaleDateString('fr-FR');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'decimal',
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        }).format(amount) + ' DT';
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Facture ${invoiceData.invoiceNumber} - ${formatCurrency(invoiceData.totalAmount)}`,
                url: 'https://invoicescanpro.com',
                title: `Facture ${invoiceData.invoiceNumber}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditField = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`${API_URL}/invoices/${invoiceData._id}`, editedData);
            setInvoiceData(response.data);
            setIsEditing(false);
            Alert.alert('Succès', 'Facture mise à jour avec succès');
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', "Échec de la mise à jour de la facture");
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir supprimer cette facture?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_URL}/invoices/${invoiceData._id}`);
                            router.back();
                            Alert.alert('Succès', 'Facture supprimée avec succès');
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Erreur', "Échec de la suppression de la facture");
                        }
                    }
                }
            ]
        );
    };

    const handleMarkAsPaid = async () => {
        try {
            const response = await axios.put(`${API_URL}/invoices/${invoiceData._id}/mark-as-paid`, {
                paymentDate: new Date().toISOString().split('T')[0]
            });
            setInvoiceData(response.data);
            Alert.alert('Succès', 'Facture marquée comme payée');
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', "Échec du marquage comme payée");
        }
    };

    const openDatePicker = (field) => {
        setDateField(field);
        setShowDatePicker(true);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;

            handleEditField(dateField, formattedDate);
        }
    };

    const renderEditableField = (label, value, field) => (
        <View style={styles.editRow}>
            <Text style={styles.editLabel}>{label}:</Text>
            <TextInput
                style={styles.editInput}
                value={value}
                onChangeText={(text) => handleEditField(field, text)}
            />
        </View>
    );

    const renderEditableDateField = (label, value, field) => (
        <View style={styles.editRow}>
            <Text style={styles.editLabel}>{label}:</Text>
            <TouchableOpacity
                style={styles.dateInput}
                onPress={() => openDatePicker(field)}
            >
                <Text>{value || 'Sélectionner une date'}</Text>
            </TouchableOpacity>
        </View>
    );

    const supplier = getSupplier();
    const items = getItems();
    const isOverdue = invoiceData.dueDate &&
        new Date(invoiceData.dueDate.split('/').reverse().join('-')) < new Date() &&
        invoiceData.paymentStatus !== 'paid';

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryLight]}
                style={styles.headerGradient}
            >
                <Text style={styles.invoiceNumber}>{invoiceData.invoiceNumber}</Text>
                {isOverdue && (
                    <View style={styles.overdueBadge}>
                        <Text style={styles.overdueText}>EN RETARD</Text>
                    </View>
                )}
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {isEditing ? (
                    <View style={styles.editSection}>
                        {renderEditableField('Numéro', editedData.invoiceNumber, 'invoiceNumber')}
                        {renderEditableDateField('Date facture', editedData.invoiceDate, 'invoiceDate')}
                        {renderEditableDateField('Date échéance', editedData.dueDate, 'dueDate')}

                        <View style={styles.editButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsEditing(false)}
                            >
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                            >
                                <Text style={styles.buttonText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Informations</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Date:</Text>
                                <Text style={styles.infoValue}>{formatDate(invoiceData.invoiceDate)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Échéance:</Text>
                                <Text style={styles.infoValue}>{formatDate(invoiceData.dueDate)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Statut:</Text>
                                <View style={[
                                    styles.statusBadge,
                                    invoiceData.paymentStatus === 'paid' ? styles.paidStatus : styles.pendingStatus
                                ]}>
                                    <Text style={styles.statusText}>
                                        {invoiceData.paymentStatus === 'paid' ? 'Payée' : 'En attente'}
                                    </Text>
                                </View>
                            </View>
                            {invoiceData.paymentDate && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Payée le:</Text>
                                    <Text style={styles.infoValue}>{formatDate(invoiceData.paymentDate)}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Fournisseur</Text>
                            <Text style={styles.supplierName}>{supplier.name}</Text>
                            {supplier.address && (
                                <Text style={styles.supplierAddress}>{supplier.address}</Text>
                            )}
                            {supplier.taxId && (
                                <Text style={styles.supplierTaxId}>ID Fiscal: {supplier.taxId}</Text>
                            )}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Montants</Text>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountLabel}>Sous-total:</Text>
                                <Text style={styles.amountValue}>{formatCurrency(invoiceData.subtotal)}</Text>
                            </View>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountLabel}>TVA:</Text>
                                <Text style={styles.amountValue}>{formatCurrency(invoiceData.taxAmount)}</Text>
                            </View>
                            <View style={[styles.amountRow, styles.totalAmountRow]}>
                                <Text style={styles.totalLabel}>Total:</Text>
                                <Text style={styles.totalAmount}>{formatCurrency(invoiceData.totalAmount)}</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Articles ({items.length})</Text>
                            {items.map((item, index) => (
                                <View key={index} style={styles.itemRow}>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                    <Text style={styles.itemQuantity}>{item.quantity}</Text>
                                    <Text style={styles.itemPrice}>{formatCurrency(item.unitPrice)}</Text>
                                    <Text style={styles.itemTotal}>{formatCurrency(item.totalPrice)}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                <View style={styles.actionsContainer}>
                    {!isEditing && (
                        <>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => setIsEditing(true)}
                            >
                                <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
                                <Text style={styles.actionButtonText}>Modifier</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={handleShare}
                            >
                                <MaterialIcons name="share" size={20} color={theme.colors.primary} />
                                <Text style={styles.actionButtonText}>Partager</Text>
                            </TouchableOpacity>
                            {invoiceData.paymentStatus !== 'paid' && (
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.payButton]}
                                    onPress={handleMarkAsPaid}
                                >
                                    <MaterialIcons name="attach-money" size={20} color="white" />
                                    <Text style={[styles.actionButtonText, { color: 'white' }]}>Marquer payée</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={handleDelete}
                            >
                                <MaterialIcons name="delete" size={20} color={theme.colors.danger} />
                                <Text style={[styles.actionButtonText, { color: theme.colors.danger }]}>Supprimer</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerGradient: {
        padding: 24,
        paddingTop: 40,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        alignItems: 'center',
    },
    invoiceNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    overdueBadge: {
        marginTop: 8,
        backgroundColor: theme.colors.danger,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    overdueText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    scrollContainer: {
        padding: 16,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: theme.colors.text,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoLabel: {
        color: theme.colors.textSecondary,
        fontSize: 16,
    },
    infoValue: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    paidStatus: {
        backgroundColor: `${theme.colors.success}20`,
    },
    pendingStatus: {
        backgroundColor: `${theme.colors.warning}20`,
    },
    statusText: {
        fontWeight: '600',
    },
    supplierName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: theme.colors.text,
    },
    supplierAddress: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    supplierTaxId: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    amountLabel: {
        color: theme.colors.textSecondary,
        fontSize: 16,
    },
    amountValue: {
        color: theme.colors.text,
        fontSize: 16,
    },
    totalAmountRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    totalLabel: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalAmount: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingVertical: 8,
    },
    itemDescription: {
        flex: 2,
        color: theme.colors.text,
    },
    itemQuantity: {
        flex: 1,
        textAlign: 'center',
        color: theme.colors.text,
    },
    itemPrice: {
        flex: 1,
        textAlign: 'right',
        color: theme.colors.text,
    },
    itemTotal: {
        flex: 1,
        textAlign: 'right',
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    actionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
        flexBasis: '48%',
        justifyContent: 'center',
    },
    actionButtonText: {
        marginLeft: 8,
        color: theme.colors.text,
        fontWeight: '500',
    },
    payButton: {
        backgroundColor: theme.colors.success,
        borderColor: theme.colors.success,
    },
    deleteButton: {
        borderColor: theme.colors.danger,
    },
    editSection: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    editRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    editLabel: {
        width: 100,
        color: theme.colors.textSecondary,
    },
    editInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        padding: 8,
    },
    dateInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        padding: 8,
    },
    editButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    cancelButton: {
        backgroundColor: theme.colors.danger,
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: theme.colors.success,
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});