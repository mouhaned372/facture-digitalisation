import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '@/constants/theme';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function ReportsPage() {
    // Données simulées pour les graphiques
    const monthlyData = {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [
            {
                data: [1200, 900, 1500, 1800, 2100, 1700],
                color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
            },
        ],
    };

    const categoryData = [
        {
            name: 'Fournitures',
            amount: 1200,
            color: '#6C63FF',
            legendFontColor: theme.colors.text,
            legendFontSize: 12,
        },
        {
            name: 'Services',
            amount: 800,
            color: '#FF6584',
            legendFontColor: theme.colors.text,
            legendFontSize: 12,
        },
        {
            name: 'Logiciels',
            amount: 1500,
            color: '#4BB543',
            legendFontColor: theme.colors.text,
            legendFontSize: 12,
        },
        {
            name: 'Abonnements',
            amount: 600,
            color: '#FFC107',
            legendFontColor: theme.colors.text,
            legendFontSize: 12,
        },
    ];

    const supplierData = [
        {
            name: 'Amazon',
            amount: 1800,
            color: '#6C63FF',
            legendFontColor: theme.colors.text,
            legendFontSize: 12,
        },
        {
            name: 'Microsoft',
            amount: 1200,
            color: '#FF6584',
            legendFontColor: theme.colors.text,
            legendFontSize: 12,
        },
        {
            name: 'Google',
            amount: 800,
            color: '#4BB543',
            legendFontColor: theme.colors.text,
            legendFontSize: 12,
        },
    ];

    const chartConfig = {
        backgroundColor: theme.colors.card,
        backgroundGradientFrom: theme.colors.card,
        backgroundGradientTo: theme.colors.card,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(52, 58, 64, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#6C63FF',
        },
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Analyses et Rapports</Text>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <MaterialIcons name="show-chart" size={20} color={theme.colors.primary} />
                    <Text style={styles.cardTitle}>Dépenses mensuelles</Text>
                </View>
                <BarChart
                    data={monthlyData}
                    width={screenWidth - theme.spacing.xl * 2}
                    height={220}
                    yAxisLabel="€"
                    yAxisSuffix=""
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    fromZero
                    showBarTops={false}
                    style={styles.chart}
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.card, { flex: 1 }]}>
                    <View style={styles.cardHeader}>
                        <MaterialIcons name="pie-chart" size={20} color={theme.colors.primary} />
                        <Text style={styles.cardTitle}>Par catégorie</Text>
                    </View>
                    <PieChart
                        data={categoryData}
                        width={screenWidth / 2 - theme.spacing.xl * 1.5}
                        height={160}
                        chartConfig={chartConfig}
                        accessor="amount"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                        style={styles.chart}
                    />
                </View>

                <View style={[styles.card, { flex: 1 }]}>
                    <View style={styles.cardHeader}>
                        <MaterialIcons name="business" size={20} color={theme.colors.primary} />
                        <Text style={styles.cardTitle}>Par fournisseur</Text>
                    </View>
                    <PieChart
                        data={supplierData}
                        width={screenWidth / 2 - theme.spacing.xl * 1.5}
                        height={160}
                        chartConfig={chartConfig}
                        accessor="amount"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                        style={styles.chart}
                    />
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <MaterialIcons name="attach-money" size={20} color={theme.colors.primary} />
                    <Text style={styles.cardTitle}>Statistiques clés</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>2,450€</Text>
                        <Text style={styles.statLabel}>Dépenses ce mois</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>+12%</Text>
                        <Text style={styles.statLabel}>vs mois dernier</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>18</Text>
                        <Text style={styles.statLabel}>Factures ce mois</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.xl,
    },
    title: {
        ...theme.text.h1,
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    cardTitle: {
        ...theme.text.h3,
        color: theme.colors.text,
        marginLeft: theme.spacing.sm,
    },
    chart: {
        borderRadius: theme.radius.md,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        ...theme.text.h2,
        color: theme.colors.primary,
    },
    statLabel: {
        ...theme.text.caption,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
});