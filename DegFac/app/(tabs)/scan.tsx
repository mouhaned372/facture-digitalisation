import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';

export default function GalleryUploadPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'We need access to your gallery to upload invoices');
            }
        })();
    }, []);

    const pickImage = async () => {
        setIsLoading(true);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [30, 40],
                quality: 0.8,
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
            // First verify the module is available
            if (!ImageManipulator.manipulateAsync) {
                throw new Error("Image manipulation not available");
            }

            // Process the image
            const processedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1000 } }],
                {
                    compress: 0.7,
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            {selectedImage ? (
                <Image
                    source={{ uri: selectedImage }}
                    style={{
                        width: '100%',
                        height: 300,
                        resizeMode: 'contain',
                        marginBottom: 20
                    }}
                />
            ) : (
                <Ionicons
                    name="document-attach"
                    size={100}
                    color="#ccc"
                    style={{ marginBottom: 20 }}
                />
            )}

            <Text style={{ fontSize: 18, marginBottom: 30, textAlign: 'center' }}>
                {selectedImage
                    ? "Facture sélectionnée, traitement en cours..."
                    : "Sélectionnez une facture depuis votre galerie"}
            </Text>

            <TouchableOpacity
                style={{
                    backgroundColor: isLoading ? '#ccc' : '#007AFF',
                    padding: 15,
                    borderRadius: 10,
                    width: '80%',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
                onPress={pickImage}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
                ) : (
                    <Ionicons name="images" size={24} color="white" style={{ marginRight: 10 }} />
                )}
                <Text style={{ color: 'white', fontSize: 18 }}>
                    {isLoading ? 'Traitement...' : 'Choisir une facture'}
                </Text>
            </TouchableOpacity>

            {selectedImage && (
                <TouchableOpacity
                    style={{
                        marginTop: 20,
                        padding: 10,
                    }}
                    onPress={() => setSelectedImage(null)}
                    disabled={isLoading}
                >
                    <Text style={{ color: '#007AFF', fontSize: 16 }}>Changer d'image</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}