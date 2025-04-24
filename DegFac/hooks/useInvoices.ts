import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { API_URL } from '../constants/config';

interface Invoice {
    _id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
    extractedData: any;
    date: string;
    type: string;
    amount?: number;
    vendor?: string;
}

interface Filters {
    sortBy?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: string;
    maxAmount?: string;
}

interface UseInvoicesResult {
    invoices: Invoice[];
    loading: boolean;
    error: string | null;
    filters: Filters;
    setFilters: (filters: Filters) => void;
    refreshInvoices: (filters?: Filters) => Promise<void>;
    uploadInvoice: (fileUri: string) => Promise<any>;
}

export function useInvoices(initialFilters: Filters = {}): UseInvoicesResult {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>(initialFilters);

    const fetchInvoices = async (params: Filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get<Invoice[]>(`${API_URL}/invoices`, {
                params: {
                    sortBy: params.sortBy || filters.sortBy,
                    type: params.type || filters.type,
                    startDate: params.startDate || filters.startDate,
                    endDate: params.endDate || filters.endDate,
                    minAmount: params.minAmount || filters.minAmount,
                    maxAmount: params.maxAmount || filters.maxAmount,
                },
                headers: {
                    'Authorization': `Bearer ${await getAuthToken()}`,
                }
            });

            setInvoices(response.data);
        } catch (err) {
            console.error('Error fetching invoices:', err);
            setError(err.response?.data?.message || 'Erreur lors de la récupération des factures');
        } finally {
            setLoading(false);
        }
    };

    const uploadInvoice = async (fileUri: string) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (!fileInfo.exists) {
                throw new Error('Fichier introuvable');
            }

            const formData = new FormData();
            formData.append('file', {
                uri: fileUri,
                name: fileUri.split('/').pop(),
                type: 'image/jpeg',
            } as any);

            const response = await axios.post(`${API_URL}/invoices`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${await getAuthToken()}`,
                },
            });

            return response.data;
        } catch (err) {
            console.error('Error uploading invoice:', err);
            Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors du téléchargement de la facture');
            throw err;
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return {
        invoices,
        loading,
        error,
        filters,
        setFilters,
        refreshInvoices: fetchInvoices,
        uploadInvoice,
    };
}

async function getAuthToken(): Promise<string> {
    // Implémentez votre propre logique pour récupérer le token d'authentification
    return 'your-auth-token';
}