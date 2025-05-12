import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export default function InvoiceItem({ invoice, onPress, isOverdue }) {
    const formatDate = (dateString) => {
        if (!dateString) return '--/--';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
            });
        } catch {
            return dateString.split('/').slice(0, 2).join('/');
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
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                isOverdue && styles.overdueContainer
            ]}
        >
            <View style={styles.leftContent}>
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
                    <Text style={styles.supplier} numberOfLines={1}>
                        {invoice.supplier?.name || 'Fournisseur inconnu'}
                    </Text>
                </View>
            </View>

            <View style={styles.rightContent}>
                <Text style={styles.amount}>
                    {formatAmount(invoice.totalAmount)}
                </Text>
                <View style={styles.dateContainer}>
                    <MaterialIcons
                        name="event"
                        size={14}
                        color={theme.colors.textSecondary}
                    />
                    <Text style={styles.date}>
                        {formatDate(invoice.invoiceDate)}
                    </Text>
                </View>
            </View>

            {isOverdue && (
                <View style={styles.overdueBadge}>
                    <MaterialIcons name="warning" size={14} color="white" />
                </View>
            )}

            <MaterialIcons
                name="chevron-right"
                size={20}
                color={theme.colors.textSecondary}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    overdueContainer: {
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.danger,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
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
        fontWeight: '600',
        color: theme.colors.text,
        fontSize: 15,
    },
    supplier: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        marginTop: 4,
        maxWidth: 180,
    },
    rightContent: {
        alignItems: 'flex-end',
        marginLeft: 12,
        gap: 4,
    },
    amount: {
        fontWeight: '600',
        color: theme.colors.text,
        fontSize: 15,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    date: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    overdueBadge: {
        backgroundColor: theme.colors.danger,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
});