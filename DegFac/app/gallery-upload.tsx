import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

export default function GalleryUploadPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission requise',
                    'Nous avons besoin d\'accéder à votre galerie pour importer des factures'
                );
            }
        })();
    }, []);

    const pickImage = async () => {
        setIsLoading(true);
        setProgress(0);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled && result.assets[0].uri) {
                setSelectedImage(result.assets[0].uri);
                await processAndUploadImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', "Une erreur s'est produite lors de la sélection de l'image");
        } finally {
            setIsLoading(false);
        }
    };

    const processAndUploadImage = async (uri: string) => {
        try {
            // Process the image
            const processedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1200 } }],
                {
                    compress: 0.8,
                    format: ImageManipulator.SaveFormat.JPEG
                }
            );

            await uploadImage(processedImage.uri);
        } catch (error) {
            console.error('Image processing error:', error);
            await uploadImage(uri);
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            const formData = new FormData();
            formData.append('image', {
                uri,
                name: 'invoice.jpg',
                type: 'image/jpeg',
            } as any);

            const response = await axios.post(`${API_URL}/invoices/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                },
            });

            router.push({
                pathname: '/modal',
                params: { invoice: JSON.stringify(response.data) },
            });
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', "Échec de l'extraction des données de la facture");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Importer une facture</Text>
                <Text style={styles.subtitle}>Sélectionnez une image depuis votre galerie</Text>
            </View>

            <View style={styles.imageContainer}>
                {selectedImage ? (
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <FontAwesome name="file-image-o" size={80} color={theme.colors.placeholder} />
                        <Text style={styles.placeholderText}>Aucune image sélectionnée</Text>
                    </View>
                )}

                {isLoading && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progress}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{progress}%</Text>
                    </View>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={pickImage}
                    disabled={isLoading}
                >
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.primaryLight]}
                        style={styles.gradientButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <MaterialIcons name="photo-library" size={24} color="white" />
                        )}
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Traitement en cours...' : 'Choisir une facture'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {selectedImage && !isLoading && (
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => setSelectedImage(null)}
                    >
                        <Text style={styles.secondaryButtonText}>Changer d'image</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>Conseils pour une meilleure extraction :</Text>
                <View style={styles.tipItem}>
                    <MaterialIcons name="check" size={16} color={theme.colors.primary} />
                    <Text style={styles.tipText}>Photographiez sous un bon éclairage</Text>
                </View>
                <View style={styles.tipItem}>
                    <MaterialIcons name="check" size={16} color={theme.colors.primary} />
                    <Text style={styles.tipText}>Cadrez bien toute la facture</Text>
                </View>
                <View style={styles.tipItem}>
                    <MaterialIcons name="check" size={16} color={theme.colors.primary} />
                    <Text style={styles.tipText}>Évitez les reflets et ombres</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.background,
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
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: theme.spacing.xl,
    },
    image: {
        width: '100%',
        height: '70%',
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        borderRadius: theme.radius.md,
    },
    placeholderText: {
        ...theme.text.body,
        color: theme.colors.placeholder,
        marginTop: theme.spacing.md,
    },
    progressContainer: {
        marginTop: theme.spacing.lg,
        alignItems: 'center',
    },
    progressBar: {
        height: 6,
        width: '100%',
        backgroundColor: theme.colors.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
    },
    progressText: {
        ...theme.text.caption,
        color: theme.colors.text,
        marginTop: theme.spacing.sm,
    },
    buttonContainer: {
        marginBottom: theme.spacing.xl,
    },
    button: {
        borderRadius: theme.radius.md,
        overflow: 'hidden',
        elevation: 3,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    gradientButton: {
        padding: theme.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        ...theme.text.body,
        color: 'white',
        fontWeight: '600',
        marginLeft: theme.spacing.md,
    },
    secondaryButton: {
        marginTop: theme.spacing.md,
        alignItems: 'center',
    },
    secondaryButtonText: {
        ...theme.text.body,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    tipsContainer: {
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
    },
    tipsTitle: {
        ...theme.text.h3,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    tipText: {
        ...theme.text.body,
        color: theme.colors.text,
        marginLeft: theme.spacing.sm,
    },
});