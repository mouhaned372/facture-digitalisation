import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useState } from 'react';

export default function SettingsPage() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

    const settingsItems = [
        {
            icon: 'notifications',
            title: 'Notifications',
            description: 'Activer/désactiver les notifications',
            action: (
                <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.placeholder}
                    trackColor={{
                        true: `${theme.colors.primary}50`,
                        false: theme.colors.border,
                    }}
                />
            ),
        },
        {
            icon: 'moon',
            title: 'Mode sombre',
            description: 'Basculer entre le mode clair et sombre',
            action: (
                <Switch
                    value={darkModeEnabled}
                    onValueChange={setDarkModeEnabled}
                    thumbColor={darkModeEnabled ? theme.colors.primary : theme.colors.placeholder}
                    trackColor={{
                        true: `${theme.colors.primary}50`,
                        false: theme.colors.border,
                    }}
                />
            ),
        },
        {
            icon: 'sync',
            title: 'Synchronisation automatique',
            description: 'Synchroniser automatiquement avec le cloud',
            action: (
                <Switch
                    value={autoSyncEnabled}
                    onValueChange={setAutoSyncEnabled}
                    thumbColor={autoSyncEnabled ? theme.colors.primary : theme.colors.placeholder}
                    trackColor={{
                        true: `${theme.colors.primary}50`,
                        false: theme.colors.border,
                    }}
                />
            ),
        },
        {
            icon: 'cloud-upload',
            title: 'Sauvegarde',
            description: 'Sauvegarder vos données',
            action: <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />,
        },
        {
            icon: 'shield',
            title: 'Sécurité',
            description: 'Paramètres de sécurité et confidentialité',
            action: <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />,
        },
        {
            icon: 'help-circle',
            title: 'Aide & Support',
            description: 'FAQ et contact du support',
            action: <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />,
        },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Paramètres</Text>
                <Text style={styles.subtitle}>Personnalisez votre expérience</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Préférences</Text>
                {settingsItems.slice(0, 3).map((item, index) => (
                    <TouchableOpacity key={index} style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Ionicons name={item.icon as any} size={20} color={theme.colors.primary} />
                        </View>
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>{item.title}</Text>
                            <Text style={styles.settingDescription}>{item.description}</Text>
                        </View>
                        {item.action}
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Compte et données</Text>
                {settingsItems.slice(3, 5).map((item, index) => (
                    <TouchableOpacity key={index} style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Ionicons name={item.icon as any} size={20} color={theme.colors.primary} />
                        </View>
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>{item.title}</Text>
                            <Text style={styles.settingDescription}>{item.description}</Text>
                        </View>
                        {item.action}
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Aide</Text>
                {settingsItems.slice(5).map((item, index) => (
                    <TouchableOpacity key={index} style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Ionicons name={item.icon as any} size={20} color={theme.colors.primary} />
                        </View>
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>{item.title}</Text>
                            <Text style={styles.settingDescription}>{item.description}</Text>
                        </View>
                        {item.action}
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.logoutButton}>
                <MaterialIcons name="logout" size={20} color={theme.colors.danger} />
                <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Version 1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.xl,
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
    section: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.text.h3,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${theme.colors.primary}20`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        ...theme.text.body,
        color: theme.colors.text,
        fontWeight: '500',
    },
    settingDescription: {
        ...theme.text.caption,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        backgroundColor: `${theme.colors.danger}10`,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.xl,
    },
    logoutText: {
        ...theme.text.body,
        color: theme.colors.danger,
        fontWeight: '500',
        marginLeft: theme.spacing.sm,
    },
    versionText: {
        ...theme.text.caption,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});