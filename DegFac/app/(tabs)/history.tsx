import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import InvoiceItem from '@/components/InvoiceItem';
import { Invoice } from '@/types/invoice';
import axios from 'axios';
import { API_URL } from '@/constants/config';

export default function HistoryPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setRefreshing(true);
            const response = await axios.get(`${API_URL}/invoices`);
            if (response.data && Array.isArray(response.data)) {
                const validInvoices = response.data.filter(inv => inv && inv.totalAmount !== undefined);
                setInvoices(validInvoices);
                if (validInvoices.length !== response.data.length) {
                    console.warn('Certaines factures ont été filtrées car incomplètes');
                }
                setError(null);
            } else {
                setError('Format de réponse invalide');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur de chargement des factures');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => fetchInvoices();

    const paidInvoices = invoices.filter(inv => inv.paymentStatus === 'paid');
    const pendingInvoices = invoices.filter(inv => inv.paymentStatus !== 'paid');
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

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
                data={invoices.filter(inv => inv && inv._id)}
                renderItem={({ item }) => (
                    <InvoiceItem
                        invoice={item}
                        onPress={() => router.push({
                            pathname: '/modal',
                            params: { invoice: JSON.stringify(item) }
                        })}
                    />
                )}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{invoices.length}</Text>
                                <Text style={styles.statLabel}>Total</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{paidInvoices.length}</Text>
                                <Text style={styles.statLabel}>Payées</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{pendingInvoices.length}</Text>
                                <Text style={styles.statLabel}>En attente</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>
                                    {totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                </Text>
                                <Text style={styles.statLabel}>Montant total</Text>
                            </View>
                        </View>

                        <View style={styles.filterContainer}>
                            <TouchableOpacity style={styles.filterButton}>
                                <Text style={styles.filterButtonText}>Toutes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterButton}>
                                <Text style={styles.filterButtonText}>Payées</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterButton}>
                                <Text style={styles.filterButtonText}>En attente</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterButton}>
                                <MaterialIcons name="filter-list" size={20} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="receipt" size={60} color={theme.colors.placeholder} />
                        <Text style={styles.emptyText}>Aucune facture trouvée</Text>
                        <Text style={styles.emptySubtext}>
                            Scannez ou importez votre première facture pour commencer
                        </Text>
                    </View>
                }
                refreshing={refreshing}
                onRefresh={handleRefresh}
                contentContainerStyle={invoices.length === 0 ? { flex: 1 } : null}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
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
        padding: theme.spacing.xl,
    },
    errorText: {
        ...theme.text.h3,
        color: theme.colors.danger,
        marginTop: theme.spacing.md,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: theme.spacing.lg,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.md,
    },
    retryButtonText: {
        ...theme.text.body,
        color: 'white',
        fontWeight: '600',
    },
    header: {
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.lg,
    },
    statCard: {
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.md,
        flex: 1,
        marginHorizontal: theme.spacing.xs,
    },
    statValue: {
        ...theme.text.h3,
        color: theme.colors.primary,
    },
    statLabel: {
        ...theme.text.caption,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    filterButton: {
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.sm,
        flex: 1,
        marginHorizontal: theme.spacing.xs,
        alignItems: 'center',
    },
    filterButtonText: {
        ...theme.text.caption,
        color: theme.colors.text,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    emptyText: {
        ...theme.text.h3,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.lg,
    },
    emptySubtext: {
        ...theme.text.body,
        color: theme.colors.placeholder,
        marginTop: theme.spacing.sm,
        textAlign: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginHorizontal: theme.spacing.lg,
    },
});
