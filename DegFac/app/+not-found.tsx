import { View, Text, StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>404 - Page non trouvée</Text>
        <Text style={{ color: colors.text }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </Text>
        <Link href="/" asChild>
          <Button title="Retour à l'accueil" />
        </Link>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});