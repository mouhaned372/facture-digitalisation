import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useInvoices } from '../../hooks/useInvoices';
import InvoiceList from '../../components/InvoiceList';

interface Filters {
    sortBy: string;
    type: string;
    startDate: string;
    endDate: string;
    minAmount: string;
    maxAmount: string;
}

export default function InvoicesScreen() {
    const router = useRouter();
    const { invoices, loading, error, refreshInvoices } = useInvoices();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        sortBy: 'date_desc',
        type: '',
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: ''
    });

    const onRefresh = async () => {
        setIsRefreshing(true);
        await refreshInvoices(filters);
        setIsRefreshing(false);
    };

    const applyFilters = async () => {
        setFilterModalVisible(false);
        await refreshInvoices(filters);
    };

    const clearFilters = async () => {
        const defaultFilters: Filters = {
            sortBy: 'date_desc',
            type: '',
            startDate: '',
            endDate: '',
            minAmount: '',
            maxAmount: ''
        };
        setFilters(defaultFilters);
        await refreshInvoices(defaultFilters);
        setFilterModalVisible(false);
    };

    if (loading && !isRefreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={onRefresh}>
                    <Text style={styles.retryText}>Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mes Factures</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                    <Ionicons name="filter" size={24} color="#4285F4" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={invoices}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <InvoiceList invoice={item} />}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aucune facture trouvée</Text>
                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={() => router.push('/camera')}
                        >
                            <Text style={styles.scanButtonText}>Scanner une facture</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filtrer les factures</Text>

                        <Text style={styles.filterLabel}>Trier par:</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => setFilters({...filters, sortBy: 'date_desc'})}
                            >
                                <Ionicons
                                    name={filters.sortBy === 'date_desc' ? 'radio-button-on' : 'radio-button-off'}
                                    size={20}
                                    color="#4285F4"
                                />
                                <Text style={styles.radioLabel}>Plus récentes</Text>
                            </TouchableOpacity>

                            {/* Autres options de tri... */}
                        </View>

                        {/* Autres champs de filtre... */}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={clearFilters}
                            >
                                <Text style={styles.cancelButtonText}>Réinitialiser</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.applyButton]}
                                onPress={applyFilters}
                            >
                                <Text style={styles.applyButtonText}>Appliquer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
        padding: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    retryText: {
        color: '#4285F4',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    scanButton: {
        backgroundColor: '#4285F4',
        padding: 15,
        borderRadius: 10,
    },
    scanButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    filterLabel: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    radioGroup: {
        marginBottom: 10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    radioLabel: {
        marginLeft: 10,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateInput: {
        flex: 1,
    },
    dateSeparator: {
        marginHorizontal: 10,
    },
    amountInput: {
        flex: 1,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        padding: 15,
        borderRadius: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f1f1f1',
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#666',
    },
    applyButton: {
        backgroundColor: '#4285F4',
    },
    applyButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});