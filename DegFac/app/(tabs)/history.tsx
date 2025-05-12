import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
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

            const updatedInvoices = allInvoices.map(invoice => ({
                ...invoice,
                isOverdue: overdueInvoices.some(ov => ov._id === invoice._id)
            }));

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
                <Text style={styles.loadingText}>Chargement des factures...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <View style={styles.errorCard}>
                    <MaterialIcons name="error-outline" size={32} color={theme.colors.danger} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={fetchInvoices}
                    >
                        <Text style={styles.retryButtonText}>Réessayer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Historique des Factures</Text>
                <View style={styles.headerActions}>
                    {invoices.some(i => i.isOverdue) && (
                        <TouchableOpacity
                            style={styles.alertBadge}
                            onPress={() => router.push('/overdue')}
                        >
                            <MaterialIcons name="warning" size={16} color="white" />
                            <Text style={styles.alertText}>Retard</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.filterButton}>
                        <MaterialIcons name="filter-list" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

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
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIllustration}>
                            <MaterialIcons
                                name="receipt"
                                size={48}
                                color={theme.colors.placeholder}
                            />
                        </View>
                        <Text style={styles.emptyTitle}>Aucune facture trouvée</Text>
                        <Text style={styles.emptySubtitle}>
                            Scannez ou importez votre première facture pour commencer
                        </Text>
                        <TouchableOpacity
                            style={styles.emptyAction}
                            onPress={() => router.push('/scan')}
                        >
                            <Text style={styles.emptyActionText}>Scanner une facture</Text>
                        </TouchableOpacity>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
                contentContainerStyle={styles.listContent}
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
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    errorText: {
        fontSize: 16,
        color: theme.colors.text,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
        marginBottom:50,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.text,
    },
    headerActions: {
        flexDirection: 'column-reverse',
        alignItems: 'center',
        gap: 12,
    },
    alertBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.danger,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    alertText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    filterButton: {
        padding: 6,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    separator: {
        height: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        gap: 16,
    },
    emptyIllustration: {
        backgroundColor: theme.colors.backgroundLight,
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        maxWidth: 300,
        lineHeight: 20,
    },
    emptyAction: {
        marginTop: 16,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyActionText: {
        color: 'white',
        fontWeight: '600',
    },
});