import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Invoice } from '@/types/invoice';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

export default function InvoiceModal() {
    const { invoice } = useLocalSearchParams();
    const router = useRouter();
    const invoiceData: Invoice = JSON.parse(invoice as string);

    // Fonction pour obtenir les données du fournisseur (priorité à supplier racine, sinon extractedData)
    const getSupplier = () => {
        return invoiceData.supplier || invoiceData.extractedData?.supplier || {
            name: 'Fournisseur inconnu',
            address: null,
            taxId: null
        };
    };

    // Fonction pour obtenir les articles avec des valeurs par défaut
    const getItems = () => {
        return (invoiceData.items || invoiceData.extractedData?.items || []).map(item => ({
            description: item.description || 'Article non spécifié',
            quantity: item.quantity ?? 1,
            unitPrice: item.unitPrice ?? 0,
            totalPrice: item.totalPrice ?? (item.unitPrice ?? 0) * (item.quantity ?? 1)
        }));
    };
    const formatDate = (dateInput: string | { $date: { $numberLong: string } } | undefined) => {
        // Si la date est undefined ou null
        if (!dateInput) return 'Date inconnue';

        let date: Date;

        // Si la date est dans le format MongoDB { $date: { $numberLong: "..." } }
        if (typeof dateInput === 'object' && dateInput.$date?.$numberLong) {
            date = new Date(parseInt(dateInput.$date.$numberLong));
        }
        // Si c'est déjà une string au format JJ/MM/AAAA
        else if (typeof dateInput === 'string' && dateInput.includes('/')) {
            const [day, month, year] = dateInput.split('/');
            date = new Date(`${year}-${month}-${day}`);
        }
        // Sinon, essayer de parser comme date ISO
        else {
            date = new Date(dateInput);
        }

        // Vérifier si la date est valide
        if (isNaN(date.getTime())) {
            return 'Date inconnue';
        }

        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };
    const formatCurrency = (amount: number) => {
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
    const supplier = getSupplier();
    const items = getItems();
    const subtotal = invoiceData.subtotal ?? invoiceData.extractedData?.subtotal ?? 0;
    const taxAmount = invoiceData.taxAmount ?? invoiceData.extractedData?.taxAmount ?? 0;
    const totalAmount = invoiceData.totalAmount ?? invoiceData.extractedData?.totalAmount ?? 0;

    // Calcul du pourcentage de TVA si nécessaire
    const taxPercentage = subtotal > 0 ? Math.round((taxAmount / subtotal) * 100) : 0;

    const renderSection = (title: string, content: React.ReactNode, icon?: string) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                {icon && (
                    <MaterialIcons
                        name={icon as any}
                        size={20}
                        color={theme.colors.primary}
                        style={styles.sectionIcon}
                    />
                )}
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <View style={styles.sectionContent}>
                {content}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryLight]}
                style={styles.headerGradient}
            >

                <Text style={styles.headerTitle}></Text>
                <Text style={styles.invoiceNumber}>{invoiceData.invoiceNumber}</Text>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Informations Générales */}
                {renderSection('Informations Générales', (
                    <>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Date:</Text>
                            <Text style={styles.infoValue}>
                                {formatDate(invoiceData.invoiceDate || invoiceData.extractedData?.invoiceDate)}
                            </Text>
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
                    </>
                ), 'info')}

                {/* Fournisseur */}
                {/* Fournisseur */}
                {renderSection('Fournisseur', (
                    <>
                        <Text style={styles.supplierName}>{supplier.name}</Text>

                        {supplier.address && (
                            <View style={styles.addressContainer}>
                                <MaterialIcons name="location-on" size={16} color={theme.colors.textSecondary} />
                                <Text style={styles.supplierAddress}>
                                    {supplier.address.split('\n').map((line, i, arr) => (
                                        <Text key={i}>
                                            {line}
                                            {i !== arr.length - 1 ? '\n' : ''}
                                        </Text>
                                    ))}
                                </Text>
                            </View>
                        )}

                        {supplier.taxId && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Identifiant fiscal:</Text>
                                <Text style={styles.infoValue}>{supplier.taxId}</Text>
                            </View>
                        )}
                    </>
                ), 'business')}

                {/* Montants */}
                {renderSection('Montants', (
                    <>
                        <View style={styles.amountRow}>
                            <Text style={styles.amountLabel}>Sous-total:</Text>
                            <Text style={styles.amountValue}>{formatCurrency(subtotal)}</Text>
                        </View>

                        {taxAmount > 0 && (
                            <View style={styles.amountRow}>
                                <Text style={styles.amountLabel}>
                                    TVA ({taxPercentage}%):
                                </Text>
                                <Text style={styles.amountValue}>{formatCurrency(taxAmount)}</Text>
                            </View>
                        )}

                        <View style={[styles.amountRow, styles.totalAmountRow]}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
                        </View>
                    </>
                ), 'euro-symbol')}

                {/* Articles */}
                {renderSection(`Articles (${items.length})`, (
                    <View style={styles.itemsContainer}>
                        <View style={styles.itemsHeader}>
                            <Text style={[styles.itemHeaderText, { flex: 3 }]}>Description</Text>
                            <Text style={styles.itemHeaderText}>Qté</Text>
                            <Text style={styles.itemHeaderText}>Prix U.</Text>
                            <Text style={styles.itemHeaderText}>Total</Text>
                        </View>

                        {items.map((item, index) => (
                            <View key={index} style={styles.itemRow}>
                                <Text style={styles.itemDescription} numberOfLines={2}>
                                    {item.description}
                                </Text>
                                <Text style={styles.itemQuantity}>{item.quantity}</Text>
                                <Text style={styles.itemUnitPrice}>{formatCurrency(item.unitPrice)}</Text>
                                <Text style={styles.itemTotalPrice}>{formatCurrency(item.totalPrice)}</Text>
                            </View>
                        ))}
                    </View>
                ), 'list')}

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                        <MaterialIcons name="share" size={20} color={theme.colors.primary} />
                        <Text style={styles.actionButtonText}>Partager</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialIcons name="print" size={20} color={theme.colors.primary} />
                        <Text style={styles.actionButtonText}>Imprimer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialIcons name="attach-money" size={20} color={theme.colors.primary} />
                        <Text style={styles.actionButtonText}>Payer</Text>
                    </TouchableOpacity>
                </View>

                {/* Metadata */}
                {renderSection('Métadonnées', (
                    <>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>ID:</Text>
                            <Text style={styles.infoValue}>{invoiceData._id}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Créée le:</Text>
                            <Text style={styles.infoValue}>
                                {formatDate(invoiceData.createdAt)}
                            </Text>
                        </View>
                    </>
                ), 'info-outline')}
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
        paddingTop: 10,
        paddingBottom: 24,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: 'white',
        textAlign: 'center',
    },
    invoiceNumber: {
        fontSize: 22,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    scrollContainer: {
        padding: 24,
        paddingTop: 16,
    },
    section: {
        marginBottom: 24,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    sectionIcon: {
        marginRight: 8,
    },
    sectionTitle: {
        ...theme.text.h3,
        color: theme.colors.text,
    },
    sectionContent: {
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        ...theme.text.body,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    infoValue: {
        ...theme.text.body,
        color: theme.colors.text,
    },
    supplierName: {
        ...theme.text.h3,
        color: theme.colors.text,
        marginBottom: 8,
    },
    addressContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    supplierAddress: {
        ...theme.text.body,
        color: theme.colors.textSecondary,
        marginLeft: 8,
        lineHeight: 20,
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
        ...theme.text.caption,
        fontWeight: '600',
        color: theme.colors.text,
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    amountLabel: {
        ...theme.text.body,
        color: theme.colors.textSecondary,
    },
    amountValue: {
        ...theme.text.body,
        color: theme.colors.text,
    },
    totalAmountRow: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    totalLabel: {
        ...theme.text.body,
        color: theme.colors.text,
        fontWeight: '600',
    },
    totalAmount: {
        ...theme.text.h3,
        color: theme.colors.primary,
    },
    itemsContainer: {
        marginTop: 8,
    },
    itemsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    itemHeaderText: {
        ...theme.text.caption,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        textAlign: 'center',
        flex: 1,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingVertical: 8,
    },
    itemDescription: {
        flex: 3,
        paddingRight: 8,
        ...theme.text.body,
        color: theme.colors.text,
    },
    itemQuantity: {
        flex: 1,
        textAlign: 'center',
        ...theme.text.body,
        color: theme.colors.textSecondary,
    },
    itemUnitPrice: {
        flex: 1,
        textAlign: 'center',
        ...theme.text.body,
        color: theme.colors.textSecondary,
    },
    itemTotalPrice: {
        flex: 1,
        textAlign: 'right',
        ...theme.text.body,
        color: theme.colors.text,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 24,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    actionButtonText: {
        ...theme.text.caption,
        color: theme.colors.primary,
        fontWeight: '500',
        marginLeft: 8,
    },
    supplierName: {
        ...theme.text.h3,
        color: theme.colors.text,
        marginBottom: 8,
        fontWeight: '600',
    },
    supplierAddress: {
        ...theme.text.body,
        color: theme.colors.textSecondary,
        marginLeft: 8,
        lineHeight: 20,
    },
    itemDescription: {
        flex: 3,
        paddingRight: 8,
        ...theme.text.body,
        color: theme.colors.text,
        fontWeight: '500',
    },
    itemQuantity: {
        flex: 1,
        textAlign: 'center',
        ...theme.text.body,
        color: theme.colors.text,
    },
});