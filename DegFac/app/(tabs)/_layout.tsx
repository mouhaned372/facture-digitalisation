import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Définissez vos couleurs dans un fichier de constantes
const colors = {
    primary: '#2196F3', // Bleu
    gray: '#9E9E9E',    // Gris
    white: '#FFFFFF',    // Blanc
};

const TabsLayout: React.FC = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.gray,
                tabBarStyle: {
                    backgroundColor: colors.white,
                },
            }}
        >
            <Tabs.Screen
                name="scan"
                options={{
                    title: 'Scanner',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="camera-alt" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="historique"
                options={{
                    title: 'Historique',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="history" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;