import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Invoice } from '@/types/invoice';
import { Ionicons } from '@expo/vector-icons';

export default function InvoiceModal() {
    const { invoice } = useLocalSearchParams();
    const router = useRouter();
    const invoiceData: Invoice = JSON.parse(invoice as string);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const renderSection = (title: string, content: React.ReactNode) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {content}
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Détails de la Facture</Text>
                    <Text style={styles.invoiceNumber}>{invoiceData.invoiceNumber}</Text>
                </View>

                {/*/!* Informations Générales *!/*/}
                {/*{renderSection('Informations Générales', (*/}
                {/*    <>*/}
                {/*        <View style={styles.infoRow}>*/}
                {/*            <Text style={styles.infoLabel}>Date de facturation:</Text>*/}
                {/*            <Text>{formatDate(invoiceData.invoiceDate || invoiceData.createdAt)}</Text>*/}
                {/*        </View>*/}
                {/*        {invoiceData.dueDate && (*/}
                {/*            <View style={styles.infoRow}>*/}
                {/*                <Text style={styles.infoLabel}>Date d'échéance:</Text>*/}
                {/*                <Text>{formatDate(invoiceData.dueDate)}</Text>*/}
                {/*            </View>*/}
                {/*        )}*/}
                {/*        <View style={styles.infoRow}>*/}
                {/*            <Text style={styles.infoLabel}>Statut:</Text>*/}
                {/*            <Text style={[*/}
                {/*                styles.statusText,*/}
                {/*                invoiceData.paymentStatus === 'paid' ? styles.paidStatus : styles.pendingStatus*/}
                {/*            ]}>*/}
                {/*                {invoiceData.paymentStatus === 'paid' ? 'Payée' : 'En attente'}*/}
                {/*            </Text>*/}
                {/*        </View>*/}
                {/*    </>*/}
                {/*))}*/}

                {/* Fournisseur */}
                {renderSection('Fournisseur', (
                    <>
                        <Text style={styles.supplierName}>{invoiceData.supplier.name}</Text>
                        {invoiceData.supplier.address && (
                            <Text style={styles.supplierAddress}>
                                {invoiceData.supplier.address.split('\n').map((line, i) => (
                                    <Text key={i}>{line}{i !== invoiceData.supplier.address.split('\n').length - 1 ? '\n' : ''}</Text>
                                ))}
                            </Text>
                        )}
                        {invoiceData.supplier.taxId && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Identifiant fiscal:</Text>
                                <Text>{invoiceData.supplier.taxId}</Text>
                            </View>
                        )}
                    </>
                ))}

                {/* Montants */}
                {renderSection('Montants', (
                    <>
                        <View style={styles.amountRow}>
                            <Text>Sous-total:</Text>
                            <Text>{formatCurrency(invoiceData.subtotal)}</Text>
                        </View>
                        {invoiceData.taxAmount > 0 && (
                            <View style={styles.amountRow}>
                                <Text>TVA ({invoiceData.taxAmount / invoiceData.subtotal * 100}%):</Text>
                                <Text>{formatCurrency(invoiceData.taxAmount)}</Text>
                            </View>
                        )}
                        <View style={[styles.amountRow, styles.totalAmountRow]}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalAmount}>{formatCurrency(invoiceData.totalAmount)}</Text>
                        </View>
                    </>
                ))}

                {/* Articles */}
                {renderSection(`Articles (${invoiceData.items.length})`, (
                    <View style={styles.itemsContainer}>
                        <View style={styles.itemsHeader}>
                            <Text style={styles.itemHeaderText}>Description</Text>
                            <Text style={styles.itemHeaderText}>Qté</Text>
                            <Text style={styles.itemHeaderText}>Prix Unitaire</Text>
                            <Text style={styles.itemHeaderText}>Total</Text>
                        </View>
                        {invoiceData.items.map((item, index) => (
                            <View key={index} style={styles.itemRow}>
                                <Text style={styles.itemDescription}>{item.description}</Text>
                                <Text>{item.quantity || 1}</Text>
                                <Text>{formatCurrency(item.unitPrice)}</Text>
                                <Text>{formatCurrency(item.totalPrice)}</Text>
                            </View>
                        ))}
                    </View>
                ))}

                {/* Données brutes (pour débogage) */}
                {renderSection('Données Techniques', (
                    <>
                        <Text style={styles.techInfo}>ID: {invoiceData._id}</Text>
                        <Text style={styles.techInfo}>Créée le: {formatDate(invoiceData.createdAt)}</Text>
                    </>
                ))}

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="close" size={20} color="white" />
                    <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingBottom: 30,
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    invoiceNumber: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
        paddingBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoLabel: {
        fontWeight: '500',
        color: '#495057',
    },
    supplierName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    supplierAddress: {
        color: '#6c757d',
        marginBottom: 8,
        lineHeight: 20,
    },
    statusText: {
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    paidStatus: {
        color: '#28a745',
    },
    pendingStatus: {
        color: '#dc3545',
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    totalAmountRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#dee2e6',
    },
    totalLabel: {
        fontWeight: '600',
    },
    totalAmount: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemsContainer: {
        marginTop: 8,
    },
    itemsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    itemHeaderText: {
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f5',
    },
    itemDescription: {
        flex: 2,
        paddingRight: 8,
    },
    techInfo: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 4,
    },
    closeButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});