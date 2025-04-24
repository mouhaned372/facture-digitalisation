import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Facture Scanner</Text>

            <TouchableOpacity
                style={styles.scanButton}
                onPress={() => router.push('/camera')}
            >
                <Ionicons name="camera" size={50} color="white" />
                <Text style={styles.scanButtonText}>Scanner une facture</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.invoicesButton}
                onPress={() => router.push('/invoices')}
            >
                <Text style={styles.invoicesButtonText}>Voir mes factures</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40
    },
    scanButton: {
        backgroundColor: '#4285F4',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        width: '80%'
    },
    scanButtonText: {
        color: 'white',
        fontSize: 18,
        marginTop: 10
    },
    invoicesButton: {
        backgroundColor: '#34A853',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center'
    },
    invoicesButtonText: {
        color: 'white',
        fontSize: 16
    }
});