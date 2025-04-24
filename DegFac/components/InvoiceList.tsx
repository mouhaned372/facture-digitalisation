import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { formatDate, formatCurrency } from '../utils/format';

interface Invoice {
    _id: string;
    type: string;
    date: string;
    amount?: number;
    extractedData: {
        vendor?: string;
        [key: string]: any;
    };
}

interface InvoiceListProps {
    invoice: Invoice;
}

export default function InvoiceList({ invoice }: InvoiceListProps) {
    const router = useRouter();

    const navigateToDetail = () => {
        router.push({
            pathname: '/invoice-detail',
            params: { id: invoice._id }
        });
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={navigateToDetail}
        >
            <View style={styles.iconContainer}>
                <Ionicons
                    name={getIconByType(invoice.type)}
                    size={24}
                    color={getColorByType(invoice.type)}
                />
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.vendor} numberOfLines={1}>
                    {invoice.extractedData.vendor || 'Fournisseur inconnu'}
                </Text>
                <Text style={styles.date}>
                    {formatDate(invoice.date)}
                </Text>
            </View>

            <View style={styles.amountContainer}>
                <Text style={styles.amount}>
                    {formatCurrency(invoice.amount || 0)}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

function getIconByType(type: string): string {
    switch (type) {
        case 'facture': return 'document-text';
        case 'devis': return 'clipboard';
        case 'bon de commande': return 'cart';
        default: return 'document';
    }
}

function getColorByType(type: string): string {
    switch (type) {
        case 'facture': return '#EA4335';
        case 'devis': return '#FBBC05';
        case 'bon de commande': return '#34A853';
        default: return '#4285F4';
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        marginHorizontal: 15,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    vendor: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    date: {
        color: '#666',
        fontSize: 12,
    },
    amountContainer: {
        marginLeft: 10,
    },
    amount: {
        fontWeight: 'bold',
        color: '#4285F4',
    },
});