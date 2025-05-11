import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import StatsCard from '@/components/StatsCard';

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header avec bienvenue */}
            <View style={styles.header}>
                <Text style={styles.title}>Bonjour,</Text>
                <Text style={styles.subtitle}>Que souhaitez-vous faire aujourd'hui ?</Text>
            </View>

            {/* Cartes de statistiques */}
            <View style={styles.statsRow}>
                <StatsCard
                    icon="receipt"
                    value="24"
                    label="Factures ce mois"
                    color="#4E67EB"
                    iconColor="#E0E7FF"
                />
                <StatsCard
                    icon="euro-symbol"
                    value="1,245€"
                    label="Dépenses totales"
                    color="#10B981"
                    iconColor="#D1FAE5"
                />
                <StatsCard
                    icon="hourglass-empty"
                    value="5"
                    label="En attente"
                    color="#F59E0B"
                    iconColor="#FEF3C7"
                />
            </View>

            {/* Actions principales */}
            <Text style={styles.sectionTitle}>Actions principales</Text>
            <View style={styles.actionsContainer}>
                <Link href="/(tabs)/profile" asChild>
                    <TouchableOpacity style={[styles.actionCard, styles.scanCard]}>
                        <View style={styles.actionIconContainer}>
                            <FontAwesome5 name="camera" size={28} color="#4E67EB" />
                        </View>
                        <Text style={styles.actionText}>Scanner</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/gallery-upload" asChild>
                    <TouchableOpacity style={[styles.actionCard, styles.uploadCard]}>
                        <View style={styles.actionIconContainer}>
                            <Ionicons name="image" size={28} color="#10B981" />
                        </View>
                        <Text style={styles.actionText}>Importer</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/manual-entry" asChild>
                    <TouchableOpacity style={[styles.actionCard, styles.manualCard]}>
                        <View style={styles.actionIconContainer}>
                            <Feather name="edit" size={28} color="#F59E0B" />
                        </View>
                        <Text style={styles.actionText}>Saisir</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Quick actions */}
            <Text style={styles.sectionTitle}>Accès rapide</Text>
            <View style={styles.quickActions}>
                <Link href="/(tabs)/history" asChild>
                    <TouchableOpacity style={styles.quickAction}>
                        <MaterialIcons name="history" size={24} color="#4E67EB" />
                        <Text style={styles.quickActionText}>Historique</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/(tabs)/reports" asChild>
                    <TouchableOpacity style={styles.quickAction}>
                        <Ionicons name="stats-chart" size={24} color="#10B981" />
                        <Text style={styles.quickActionText}>Statistiques</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/suppliers" asChild>
                    <TouchableOpacity style={styles.quickAction}>
                        <MaterialIcons name="business" size={24} color="#F59E0B" />
                        <Text style={styles.quickActionText}>Fournisseurs</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/settings" asChild>
                    <TouchableOpacity style={styles.quickAction}>
                        <Ionicons name="settings" size={24} color="#6B7280" />
                        <Text style={styles.quickActionText}>Paramètres</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Dernières factures */}
            <View style={styles.recentSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Récentes</Text>
                    <Link href="/(tabs)/history" asChild>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>Voir tout</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
                {/* Ici vous pourriez ajouter une liste des dernières factures */}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#F9FAFB',
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        flexWrap: 'wrap',
        gap: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 16,
        flexWrap: 'wrap',
    },
    actionCard: {
        width: '30%',
        minWidth: 100,
        aspectRatio: 1,
        borderRadius: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    scanCard: {
        borderTopWidth: 4,
        borderTopColor: '#4E67EB',
    },
    uploadCard: {
        borderTopWidth: 4,
        borderTopColor: '#10B981',
    },
    manualCard: {
        borderTopWidth: 4,
        borderTopColor: '#F59E0B',
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        textAlign: 'center',
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    quickAction: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    quickActionText: {
        fontSize: 16,
        color: '#374151',
        marginLeft: 12,
    },
    recentSection: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAll: {
        color: '#4E67EB',
        fontWeight: '500',
    },
});