import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/lib/queryClient';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import axios from 'axios';
import { API_URL } from '@/constants/config';

// Configurer les notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function useNotifications(userId) {
    useEffect(() => {
        registerForPushNotificationsAsync(userId);

        // Gérer les notifications reçues en foreground
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification reçue:', notification);
        });

        return () => subscription.remove();
    }, [userId]);

    async function registerForPushNotificationsAsync(userId) {
        if (!Device.isDevice) return;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') return;

        const token = (await Notifications.getExpoPushTokenAsync()).data;

        // Enregistrer le token dans la base de données
        try {
            await axios.post(`${API_URL}/users/${userId}/push-token`, {
                expoPushToken: token
            });
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du token:', error);
        }
    }
}
export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            {/* Le reste de votre application */}
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </QueryClientProvider>
    );
}