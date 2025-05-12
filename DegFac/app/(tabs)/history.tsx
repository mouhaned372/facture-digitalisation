import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import InvoiceItem from '@/components/InvoiceItem';
import axios from 'axios';
import { API_URL } from '@/constants/config';

export default function HistoryPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setRefreshing(true);
            const [normalResponse, overdueResponse] = await Promise.all([
                axios.get(`${API_URL}/invoices`),
                axios.get(`${API_URL}/invoices/overdue`)
            ]);

            const allInvoices = normalResponse.data;
            const overdueInvoices = overdueResponse.data;

            // Marquer les factures en retard
            const updatedInvoices = allInvoices.map(invoice => {
                const isOverdue = overdueInvoices.some(ov => ov._id === invoice._id);
                return { ...invoice, isOverdue };
            });

            setInvoices(updatedInvoices);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Erreur de chargement des factures');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => fetchInvoices();

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color={theme.colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchInvoices}>
                    <Text style={styles.retryButtonText}>Réessayer</Text>
                </TouchableOpacity>
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
                        isOverdue={item.isOverdue}
                    />
                )}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Historique des Factures</Text>
                        {invoices.some(i => i.isOverdue) && (
                            <View style={styles.alertBadge}>
                                <MaterialIcons name="warning" size={20} color="white" />
                                <Text style={styles.alertText}>Factures en retard</Text>
                            </View>
                        )}
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="receipt" size={60} color={theme.colors.placeholder} />
                        <Text style={styles.emptyText}>Aucune facture trouvée</Text>
                    </View>
                }
                refreshing={refreshing}
                onRefresh={handleRefresh}
                contentContainerStyle={invoices.length === 0 ? { flex: 1 } : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 18,
        color: theme.colors.danger,
        marginVertical: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    alertBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.danger,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    alertText: {
        color: 'white',
        marginLeft: 4,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyText: {
        fontSize: 18,
        color: theme.colors.textSecondary,
        marginTop: 16,
    },
});