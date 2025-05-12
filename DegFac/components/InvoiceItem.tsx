import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export default function InvoiceItem({ invoice, onPress, isOverdue }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'Date inconnue';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
            });
        } catch {
            return dateString; // Si c'est déjà au format JJ/MM/AAAA
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <View style={[
                        styles.statusIndicator,
                        invoice.paymentStatus === 'paid'
                            ? styles.paidStatus
                            : isOverdue
                                ? styles.overdueStatus
                                : styles.pendingStatus
                    ]} />

                    <View>
                        <Text style={styles.invoiceNumber}>
                            {invoice.invoiceNumber || 'N° Inconnu'}
                        </Text>
                        <Text style={styles.supplier}>
                            {invoice.supplier?.name || 'Fournisseur inconnu'}
                        </Text>
                    </View>
                </View>

                <View style={styles.rightContainer}>
                    <Text style={styles.amount}>
                        {formatAmount(invoice.totalAmount)}
                    </Text>
                    <Text style={styles.date}>
                        {formatDate(invoice.invoiceDate)}
                    </Text>
                </View>

                {isOverdue && (
                    <MaterialIcons
                        name="warning"
                        size={20}
                        color={theme.colors.danger}
                        style={styles.warningIcon}
                    />
                )}

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
        backgroundColor: 'white',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
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
        marginRight: 12,
    },
    paidStatus: {
        backgroundColor: theme.colors.success,
    },
    pendingStatus: {
        backgroundColor: theme.colors.warning,
    },
    overdueStatus: {
        backgroundColor: theme.colors.danger,
    },
    invoiceNumber: {
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    supplier: {
        color: theme.colors.textSecondary,
        marginTop: 4,
        fontSize: 14,
    },
    rightContainer: {
        alignItems: 'flex-end',
        marginRight: 12,
    },
    amount: {
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    date: {
        color: theme.colors.textSecondary,
        marginTop: 4,
        fontSize: 14,
    },
    warningIcon: {
        marginRight: 8,
    },
});