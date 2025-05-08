import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface InvoiceItemProps {
    invoice: {
        _id: string;
        invoiceNumber: string;
        invoiceDate: string;
        paymentStatus: string;
        totalAmount: number;
        supplier: {
            name: string;
        };
    };
    onPress: () => void;
}

export default function InvoiceItem({ invoice, onPress }: InvoiceItemProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
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
                        <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
                        <Text style={styles.supplier}>{invoice.supplier.name}</Text>
                    </View>
                </View>

                <View style={styles.rightContainer}>
                    <Text style={styles.amount}>{formatCurrency(invoice.totalAmount)}</Text>
                    <Text style={styles.date}>{formatDate(invoice.invoiceDate)}</Text>
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
});