import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/lib/queryClient';

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