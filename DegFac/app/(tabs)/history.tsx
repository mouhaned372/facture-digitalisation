import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import InvoiceItem from '@/components/InvoiceItem';
import { Invoice } from '@/types/invoice';

export default function HistoryPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(`${API_URL}/invoices`);
                console.log('API Response:', response.data); // Pour le débogage

                if (response.data && Array.isArray(response.data)) {
                    // Filtrer les factures incomplètes
                    const validInvoices = response.data.filter(invoice =>
                        invoice && invoice.totalAmount !== undefined
                    );

                    setInvoices(validInvoices);

                    if (validInvoices.length !== response.data.length) {
                        console.warn('Certaines factures ont été filtrées car incomplètes');
                    }
                } else {
                    setError('Format de réponse invalide');
                }
            } catch (error) {
                console.error('Échec de la récupération des factures:', error);
                setError('Échec du chargement des factures');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={invoices}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <InvoiceItem
                        invoice={item}
                        onPress={() => router.push({
                            pathname: '/modal',
                            params: { invoice: JSON.stringify(item) }
                        })}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aucune facture scannée</Text>
                    </View>
                }
                contentContainerStyle={invoices.length === 0 ? styles.emptyListContent : undefined}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    emptyListContent: {
        flex: 1,
        justifyContent: 'center',
    },
});