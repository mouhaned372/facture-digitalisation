import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface StatsCardProps {
    icon: string;
    value: string;
    label: string;
    color: string;
}

export default function StatsCard({ icon, value, label, color }: StatsCardProps) {
    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <MaterialIcons name={icon as any} size={24} color={color} />
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '48%',
        backgroundColor: theme.colors.card,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        elevation: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: theme.radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
    },
    value: {
        ...theme.text.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    label: {
        ...theme.text.caption,
        color: theme.colors.textSecondary,
    },
});