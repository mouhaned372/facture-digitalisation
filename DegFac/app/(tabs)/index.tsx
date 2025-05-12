import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import StatsCard from '@/components/StatsCard';
import NotificationBadge from '@/components/NotificationBadge';

export default function HomeScreen() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: '1', type: 'warning', title: 'Facture en retard', message: 'La facture FAC-2023-045 est en retard', time: '2h', read: false },
        { id: '2', type: 'info', title: 'Nouveau fournisseur', message: 'Amazon a été ajouté à vos fournisseurs', time: '1j', read: true }
    ]);
    const [stats, setStats] = useState({
        invoices: 24,
        expenses: 1245,
        pending: 5
    });

    const onRefresh = () => {
        setRefreshing(true);
        // Simuler un chargement
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={theme.colors.primary}
                />
            }
        >
            {/* Header avec notifications */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Bonjour,</Text>
                    <Text style={styles.subtitle}>Que souhaitez-vous faire aujourd'hui ?</Text>
                </View>
                <TouchableOpacity
                    style={styles.notificationIcon}
                    onPress={() => router.push('/notifications')}
                >
                    <Ionicons name="notifications" size={24} color={theme.colors.text} />
                    {notifications.some(n => !n.read) && (
                        <View style={styles.notificationBadge} />
                    )}
                </TouchableOpacity>
            </View>

            {/* Bannière de notification non lue */}
            {notifications.some(n => !n.read) && (
                <TouchableOpacity
                    style={styles.notificationBanner}
                    onPress={() => router.push('/notifications')}
                >
                    <Text style={styles.notificationBannerText}>
                        Vous avez {notifications.filter(n => !n.read).length} notification(s) non lue(s)
                    </Text>
                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            )}

            {/* Cartes de statistiques */}
            <View style={styles.statsRow}>
                <StatsCard
                    icon="receipt"
                    value={stats.invoices.toString()}
                    label="Factures ce mois"
                    color={theme.colors.primary}
                    trend="up"
                    percentage="12%"
                />
                <StatsCard
                    icon="euro-symbol"
                    value={`${stats.expenses.toLocaleString()}€`}
                    label="Dépenses totales"
                    color={theme.colors.success}
                    trend="down"
                    percentage="5%"
                />
                <StatsCard
                    icon="hourglass-empty"
                    value={stats.pending.toString()}
                    label="En attente"
                    color={theme.colors.warning}
                />
            </View>

            {/* Actions principales */}
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <View style={styles.actionsGrid}>
                <Link href="/scan" asChild>
                    <TouchableOpacity style={styles.actionCard}>
                        <LinearGradient
                            colors={['#E0E7FF', '#C7D2FE']}
                            style={styles.actionIconBackground}
                        >
                            <FontAwesome5 name="camera" size={24} color={theme.colors.primary} />
                        </LinearGradient>
                        <Text style={styles.actionText}>Scanner</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/gallery-upload" asChild>
                    <TouchableOpacity style={styles.actionCard}>
                        <LinearGradient
                            colors={['#D1FAE5', '#A7F3D0']}
                            style={styles.actionIconBackground}
                        >
                            <Ionicons name="image" size={24} color={theme.colors.success} />
                        </LinearGradient>
                        <Text style={styles.actionText}>Importer</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/manual-entry" asChild>
                    <TouchableOpacity style={styles.actionCard}>
                        <LinearGradient
                            colors={['#FEF3C7', '#FDE68A']}
                            style={styles.actionIconBackground}
                        >
                            <Feather name="edit" size={24} color={theme.colors.warning} />
                        </LinearGradient>
                        <Text style={styles.actionText}>Saisir</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/history" asChild>
                    <TouchableOpacity style={styles.actionCard}>
                        <LinearGradient
                            colors={['#E0E7FF', '#C7D2FE']}
                            style={styles.actionIconBackground}
                        >
                            <MaterialIcons name="history" size={24} color={theme.colors.primary} />
                        </LinearGradient>
                        <Text style={styles.actionText}>Historique</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Dernières factures */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Dernières factures</Text>
                    <Link href="/history" asChild>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>Tout voir</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                <View style={styles.recentInvoices}>
                    <View style={styles.invoiceCard}>
                        <View style={styles.invoiceHeader}>
                            <Text style={styles.invoiceNumber}>FAC-2023-102</Text>
                            <Text style={styles.invoiceAmount}>245,75€</Text>
                        </View>
                        <View style={styles.invoiceDetails}>
                            <Text style={styles.invoiceSupplier}>Amazon</Text>
                            <Text style={styles.invoiceDate}>12/11/2023</Text>
                        </View>
                        <View style={styles.invoiceStatus}>
                            <View style={[styles.statusBadge, styles.paidBadge]}>
                                <Text style={styles.statusText}>Payée</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.invoiceCard}>
                        <View style={styles.invoiceHeader}>
                            <Text style={styles.invoiceNumber}>FAC-2023-101</Text>
                            <Text style={styles.invoiceAmount}>189,50€</Text>
                        </View>
                        <View style={styles.invoiceDetails}>
                            <Text style={styles.invoiceSupplier}>Fournisseur XYZ</Text>
                            <Text style={styles.invoiceDate}>05/11/2023</Text>
                        </View>
                        <View style={styles.invoiceStatus}>
                            <View style={[styles.statusBadge, styles.overdueBadge]}>
                                <Text style={styles.statusText}>En retard</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Notifications récentes */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    <Link href="/notifications" asChild>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>Tout voir</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                <View style={styles.notificationsList}>
                    {notifications.slice(0, 2).map(notification => (
                        <TouchableOpacity
                            key={notification.id}
                            style={[
                                styles.notificationCard,
                                !notification.read && styles.unreadNotification
                            ]}
                            onPress={() => {
                                markAsRead(notification.id);
                                router.push('/notifications');
                            }}
                        >
                            <View style={styles.notificationIconContainer}>
                                <MaterialIcons
                                    name={notification.type === 'warning' ? 'warning' : 'info'}
                                    size={20}
                                    color={notification.type === 'warning' ? theme.colors.danger : theme.colors.primary}
                                />
                            </View>
                            <View style={styles.notificationContent}>
                                <Text style={styles.notificationTitle}>{notification.title}</Text>
                                <Text style={styles.notificationMessage}>{notification.message}</Text>
                            </View>
                            <Text style={styles.notificationTime}>{notification.time}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    notificationIcon: {
        position: 'relative',
        padding: 8,
    },
    notificationBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.danger,
    },
    notificationBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    notificationBannerText: {
        color: 'white',
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 16,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    actionCard: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    actionIconBackground: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.text,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAll: {
        color: theme.colors.primary,
        fontWeight: '500',
    },
    recentInvoices: {
        gap: 12,
    },
    invoiceCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    invoiceNumber: {
        fontWeight: '600',
        color: theme.colors.text,
    },
    invoiceAmount: {
        fontWeight: '600',
        color: theme.colors.text,
    },
    invoiceDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    invoiceSupplier: {
        color: theme.colors.textSecondary,
    },
    invoiceDate: {
        color: theme.colors.textSecondary,
    },
    invoiceStatus: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    paidBadge: {
        backgroundColor: `${theme.colors.success}20`,
    },
    overdueBadge: {
        backgroundColor: `${theme.colors.danger}20`,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    notificationsList: {
        gap: 8,
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    unreadNotification: {
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
    },
    notificationIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: `${theme.colors.primary}10`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 2,
    },
    notificationMessage: {
        color: theme.colors.textSecondary,
        fontSize: 13,
    },
    notificationTime: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginLeft: 8,
    },
});