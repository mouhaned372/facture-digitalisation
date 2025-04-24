import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function Layout() {
    return (
        <View style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="camera/index" options={{ title: 'Scanner une facture' }} />
                <Stack.Screen name="invoice-detail" options={{ title: 'Détails de la facture' }} />
            </Stack>
        </View>
    );
}