import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { theme } from '@/constants/theme';

export default function LoginScreen() {
    return (
        <LinearGradient
            colors={['#6C63FF', '#8A85FF']}
            style={styles.container}
        >
            <View style={styles.content}>
                <Image
                    source={require('@/assets/images/logo.jpeg')}
                    style={styles.logo}
                />
                <Text style={styles.title}>InvoiceScan Pro</Text>
                <Text style={styles.subtitle}>Gestion intelligente de vos factures</Text>
            </View>

            <View style={styles.buttonsContainer}>
                <Link href="/(tabs)" asChild>
                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Commencer</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/gallery-upload" asChild>
                    <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>Importer une facture</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.xl,
        justifyContent: 'space-between',
    },
    content: {
        alignItems: 'center',
        marginTop: 100,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: theme.spacing.lg,
    },
    title: {
        ...theme.text.h1,
        color: 'white',
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        ...theme.text.body,
        color: 'rgba(255,255,255,0.8)',
    },
    buttonsContainer: {
        width: '100%',
        marginBottom: 50,
    },
    primaryButton: {
        backgroundColor: 'white',
        padding: theme.spacing.md,
        borderRadius: theme.radius.lg,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    primaryButtonText: {
        ...theme.text.h3,
        color: theme.colors.primary,
    },
    secondaryButton: {
        padding: theme.spacing.md,
        borderRadius: theme.radius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    secondaryButtonText: {
        ...theme.text.h3,
        color: 'white',
    },
});