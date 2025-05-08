import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import StatsCard from '@/components/StatsCard';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Bienvenue</Text>
                <Text style={styles.subtitle}>Gérez vos factures en un clin d'œil</Text>
            </View>

            <View style={styles.statsRow}>
                <StatsCard
                    icon="receipt"
                    value="24"
                    label="Factures ce mois"
                    color="#6C63FF"
                />
                <StatsCard
                    icon="euro-symbol"
                    value="1,245€"
                    label="Dépenses totales"
                    color="#FF6584"
                />
            </View>

            <View style={styles.actionsContainer}>
                <Link href="/(tabs)/scan" asChild>
                    <TouchableOpacity style={styles.actionCard}>
                        <LinearGradient
                            colors={['#6C63FF', '#8A85FF']}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <FontAwesome5 name="camera" size={24} color="white" />
                            <Text style={styles.actionText}>Scanner</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Link>

                <Link href="/gallery-upload" asChild>
                    <TouchableOpacity style={styles.actionCard}>
                        <LinearGradient
                            colors={['#FF6584', '#FF8E9E']}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name="image" size={24} color="white" />
                            <Text style={styles.actionText}>Importer</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Link>
            </View>

            <View style={styles.quickActions}>
                <Text style={styles.sectionTitle}>Actions rapides</Text>

                <View style={styles.quickActionsRow}>
                    <Link href="/(tabs)/history" asChild>
                        <TouchableOpacity style={styles.quickAction}>
                            <MaterialIcons name="receipt" size={24} color={theme.colors.primary} />
                            <Text style={styles.quickActionText}>Voir factures</Text>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/(tabs)/reports" asChild>
                        <TouchableOpacity style={styles.quickAction}>
                            <Ionicons name="stats-chart" size={24} color={theme.colors.primary} />
                            <Text style={styles.quickActionText}>Rapports</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.background,
    },
    header: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        ...theme.text.h1,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        ...theme.text.body,
        color: theme.colors.textSecondary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xl,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xl,
    },
    actionCard: {
        width: '48%',
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    gradient: {
        padding: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
    },
    actionText: {
        marginTop: theme.spacing.sm,
        color: 'white',
        ...theme.text.h3,
    },
    quickActions: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        ...theme.text.h3,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    quickActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickAction: {
        width: '48%',
        backgroundColor: theme.colors.card,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        elevation: 1,
    },
    quickActionText: {
        ...theme.text.body,
        color: theme.colors.text,
        marginLeft: theme.spacing.sm,
    },
});