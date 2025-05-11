import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

export default function ProfilePage() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <LinearGradient
                    colors={theme.gradients.primary}
                    style={styles.avatarContainer}
                >
                    <Text style={styles.avatarText}>JD</Text>
                </LinearGradient>
                <Text style={styles.name}>John Doe</Text>
                <Text style={styles.email}>john.doe@example.com</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>42</Text>
                    <Text style={styles.statLabel}>Factures</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>Pro</Text>
                    <Text style={styles.statLabel}>Abonnement</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>4.8</Text>
                    <Text style={styles.statLabel}>Évaluation</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Paramètres</Text>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <MaterialIcons name="account-circle" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.menuText}>Compte</Text>
                    <MaterialIcons name="chevron-right" size={24} color={theme.colors.gray400} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <MaterialIcons name="notifications" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.menuText}>Notifications</Text>
                    <MaterialIcons name="chevron-right" size={24} color={theme.colors.gray400} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <MaterialIcons name="security" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.menuText}>Sécurité</Text>
                    <MaterialIcons name="chevron-right" size={24} color={theme.colors.gray400} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <MaterialIcons name="payment" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.menuText}>Paiement</Text>
                    <MaterialIcons name="chevron-right" size={24} color={theme.colors.gray400} />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <MaterialIcons name="help" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.menuText}>Aide & FAQ</Text>
                    <MaterialIcons name="chevron-right" size={24} color={theme.colors.gray400} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <MaterialIcons name="email" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.menuText}>Nous contacter</Text>
                    <MaterialIcons name="chevron-right" size={24} color={theme.colors.gray400} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <MaterialIcons name="star" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.menuText}>Évaluer l'application</Text>
                    <MaterialIcons name="chevron-right" size={24} color={theme.colors.gray400} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.logoutButton, theme.shadows.sm]}>
                <Text style={styles.logoutText}>Se déconnecter</Text>
                <Feather name="log-out" size={20} color={theme.colors.danger} />
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>InvoiceScan Pro v1.0.0</Text>
                <Text style={styles.footerText}>© 2023 Tous droits réservés</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '600',
        color: theme.colors.white,
    },
    name: {
        ...theme.typography.h2,
        color: theme.colors.gray800,
        marginBottom: 4,
    },
    email: {
        ...theme.typography.body1,
        color: theme.colors.gray600,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 16,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        ...theme.typography.h3,
        color: theme.colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        ...theme.typography.body2,
        color: theme.colors.gray600,
    },
    section: {
        marginBottom: 24,
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 16,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.gray800,
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    menuIcon: {
        width: 40,
        alignItems: 'center',
    },
    menuText: {
        ...theme.typography.body1,
        color: theme.colors.gray800,
        flex: 1,
        marginLeft: 8,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        marginBottom: 24,
    },
    logoutText: {
        ...theme.typography.body1,
        color: theme.colors.danger,
        fontWeight: '600',
        marginRight: 8,
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        ...theme.typography.body2,
        color: theme.colors.gray600,
    },
});