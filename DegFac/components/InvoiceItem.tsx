import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface Supplier {
    name?: string;
}

interface Invoice {
    _id: string;
    invoiceNumber?: string;
    invoiceDate?: string;
    paymentStatus?: string;
    totalAmount?: number;
    supplier?: Supplier;
}

interface InvoiceItemProps {
    invoice: Invoice | null;
    onPress: () => void;
}

export default function InvoiceItem({ invoice, onPress }: InvoiceItemProps) {
    // Vérification de l'existence de la facture
    if (!invoice) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Facture invalide</Text>
            </View>
        );
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Date inconnue';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return 'Date invalide';
        }
    };

    const formatNumber = (amount?: number) => {
        if (amount === undefined || amount === null) return 'N/A';

        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <View style={[
                        styles.statusIndicator,
                        invoice.paymentStatus === 'paid'
                            ? styles.paidStatus
                            : styles.pendingStatus
                    ]} />

                    <View>
                        <Text style={styles.invoiceNumber}>
                            {invoice.invoiceNumber || 'N° Inconnu'}
                        </Text>
                        <Text style={styles.supplier}>
                            {invoice.supplier?.name || 'Fournisseur non spécifié'}
                        </Text>
                    </View>
                </View>

                <View style={styles.rightContainer}>
                    <Text style={styles.amount}>
                        {formatNumber(invoice.totalAmount)}
                    </Text>
                    <Text style={styles.date}>
                        {formatDate(invoice.invoiceDate)}
                    </Text>
                </View>

                <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={theme.colors.textSecondary}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: theme.spacing.md,
    },
    paidStatus: {
        backgroundColor: theme.colors.success,
    },
    pendingStatus: {
        backgroundColor: theme.colors.warning,
    },
    invoiceNumber: {
        ...theme.text.body,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    supplier: {
        ...theme.text.caption,
        color: theme.colors.textSecondary,
    },
    rightContainer: {
        alignItems: 'flex-end',
        marginRight: theme.spacing.md,
    },
    amount: {
        ...theme.text.body,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    date: {
        ...theme.text.caption,
        color: theme.colors.textSecondary,
    },
    errorText: {
        ...theme.text.body,
        color: theme.colors.danger,
        textAlign: 'center',
    },
});