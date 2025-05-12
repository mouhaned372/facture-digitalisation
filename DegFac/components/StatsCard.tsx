import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function StatsCard({ icon, value, label, color, trend, percentage }) {
    return (
        <View style={[styles.card, { borderTopColor: color }]}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                    <MaterialIcons name={icon} size={20} color={color} />
                </View>
                {trend && (
                    <View style={styles.trendContainer}>
                        <MaterialIcons
                            name={trend === 'up' ? 'trending-up' : 'trending-down'}
                            size={16}
                            color={trend === 'up' ? '#10B981' : '#EF4444'}
                        />
                        <Text style={[
                            styles.trendText,
                            { color: trend === 'up' ? '#10B981' : '#EF4444' }
                        ]}>
                            {percentage}
                        </Text>
                    </View>
                )}
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: '30%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        borderTopWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trendText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    value: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    label: {
        fontSize: 13,
        color: '#6B7280',
    },
});