import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScanScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const router = useRouter();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    Nous avons besoin de votre autorisation pour utiliser la caméra
                </Text>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={requestPermission}
                >
                    <Text style={styles.permissionButtonText}>Autoriser la caméra</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        setIsActive(false);

        // Simuler le traitement de la facture
        setTimeout(() => {
            router.push({
                pathname: '/modal',
                params: {
                    invoice: JSON.stringify({
                        _id: 'simulated_' + Math.random().toString(36).substring(7),
                        invoiceNumber: 'INV-' + Math.floor(Math.random() * 10000),
                        invoiceDate: new Date().toISOString(),
                        paymentStatus: Math.random() > 0.5 ? 'paid' : 'pending',
                        subtotal: Math.random() * 1000,
                        taxAmount: Math.random() * 200,
                        totalAmount: Math.random() * 1200,
                        supplier: {
                            name: 'Fournisseur Simulé',
                            address: '123 Rue de la Simulation\n75000 Paris',
                            taxId: 'FR' + Math.floor(Math.random() * 100000000000).toString().padStart(11, '0'),
                        },
                        items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
                            description: `Article ${i + 1}`,
                            quantity: Math.floor(Math.random() * 5) + 1,
                            unitPrice: Math.random() * 100,
                            totalPrice: Math.random() * 500,
                        })),
                        createdAt: new Date().toISOString(),
                    })
                }
            });
        }, 1500);
    };

    return (
        <View style={styles.container}>
            {isActive ? (
                <CameraView
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ['pdf417', 'qr'],
                    }}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                >
                    <View style={styles.overlay}>
                        <View style={styles.scanFrame} />
                        <Text style={styles.scanText}>Scannez le code-barres de la facture</Text>
                    </View>
                </CameraView>
            ) : (
                <View style={styles.cameraPlaceholder}>
                    <MaterialIcons name="camera" size={80} color={theme.colors.placeholder} />
                    <Text style={styles.placeholderText}>Caméra inactive</Text>
                </View>
            )}

            <View style={styles.footer}>
                <Link href="/gallery-upload" asChild>
                    <TouchableOpacity style={styles.footerButton}>
                        <MaterialIcons name="photo-library" size={24} color={theme.colors.primary} />
                        <Text style={styles.footerButtonText}>Importer depuis la galerie</Text>
                    </TouchableOpacity>
                </Link>

                {scanned && (
                    <View style={styles.processingContainer}>
                        <Text style={styles.processingText}>Traitement de la facture...</Text>
                    </View>
                )}

                {!isActive && (
                    <TouchableOpacity
                        style={styles.rescanButton}
                        onPress={() => {
                            setScanned(false);
                            setIsActive(true);
                        }}
                    >
                        <LinearGradient
                            colors={[theme.colors.primary, theme.colors.primaryLight]}
                            style={styles.gradientButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <MaterialIcons name="camera" size={24} color="white" />
                            <Text style={styles.rescanButtonText}>Scanner à nouveau</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    permissionText: {
        ...theme.text.body,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    permissionButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
    },
    permissionButtonText: {
        ...theme.text.body,
        color: 'white',
        fontWeight: '600',
    },
    camera: {
        flex: 1,
    },
    cameraPlaceholder: {
        flex: 1,
        backgroundColor: theme.colors.card,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        ...theme.text.body,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.md,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scanFrame: {
        width: 250,
        height: 350,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        backgroundColor: 'transparent',
    },
    scanText: {
        ...theme.text.body,
        color: 'white',
        marginTop: theme.spacing.lg,
        textAlign: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    footer: {
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.card,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    footerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
    },
    footerButtonText: {
        ...theme.text.body,
        color: theme.colors.primary,
        marginLeft: theme.spacing.sm,
        fontWeight: '500',
    },
    processingContainer: {
        padding: theme.spacing.md,
        backgroundColor: `${theme.colors.primary}20`,
        borderRadius: theme.radius.md,
        marginTop: theme.spacing.md,
        alignItems: 'center',
    },
    processingText: {
        ...theme.text.body,
        color: theme.colors.primary,
    },
    rescanButton: {
        marginTop: theme.spacing.md,
        borderRadius: theme.radius.md,
        overflow: 'hidden',
    },
    gradientButton: {
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rescanButtonText: {
        ...theme.text.body,
        color: 'white',
        marginLeft: theme.spacing.sm,
        fontWeight: '600',
    },
});

// import { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image, StyleSheet } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { useRouter } from 'expo-router';
// import * as ImageManipulator from 'expo-image-manipulator';
// import axios from 'axios';
// import { API_URL } from '@/constants/config';
// import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
//
// export default function GalleryUploadPage() {
//     const [isLoading, setIsLoading] = useState(false);
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [progress, setProgress] = useState(0);
//     const router = useRouter();
//
//     useEffect(() => {
//         (async () => {
//             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//             if (status !== 'granted') {
//                 Alert.alert('Permission requise', 'Nous avons besoin d\'accéder à votre galerie pour importer des factures');
//             }
//         })();
//     }, []);
//
//     const pickImage = async () => {
//         setIsLoading(true);
//         setProgress(0);
//         try {
//             const result = await ImagePicker.launchImageLibraryAsync({
//                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                 allowsEditing: true,
//                 aspect: [30, 40],
//                 quality: 0.9,
//             });
//
//             if (!result.canceled && result.assets[0].uri) {
//                 setSelectedImage(result.assets[0].uri);
//                 await processAndUploadImage(result.assets[0].uri);
//             }
//         } catch (error) {
//             console.error(error);
//             Alert.alert('Erreur', "Une erreur s'est produite lors de la sélection de l'image");
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     const processAndUploadImage = async (uri: string) => {
//         try {
//             // Process the image
//             const processedImage = await ImageManipulator.manipulateAsync(
//                 uri,
//                 [{ resize: { width: 1200 } }],
//                 {
//                     compress: 0.8,
//                     format: ImageManipulator.SaveFormat.JPEG
//                 }
//             );
//
//             await uploadImage(processedImage.uri);
//         } catch (error) {
//             console.error('Image processing error:', error);
//             await uploadImage(uri);
//         }
//     };
//
//     const uploadImage = async (uri: string) => {
//         try {
//             const formData = new FormData();
//             formData.append('image', {
//                 uri,
//                 name: 'invoice.jpg',
//                 type: 'image/jpeg',
//             } as any);
//
//             const response = await axios.post(`${API_URL}/invoices/upload`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//                 onUploadProgress: (progressEvent) => {
//                     if (progressEvent.total) {
//                         const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                         setProgress(percentCompleted);
//                     }
//                 },
//             });
//
//             router.push({
//                 pathname: '/modal',
//                 params: { invoice: JSON.stringify(response.data) },
//             });
//         } catch (error) {
//             console.error(error);
//             Alert.alert('Erreur', "Échec de l'extraction des données de la facture");
//         }
//     };
//
//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <Text style={styles.title}>Importer une facture</Text>
//                 <Text style={styles.subtitle}>Sélectionnez une image depuis votre galerie</Text>
//             </View>
//
//             <View style={styles.imageContainer}>
//                 {selectedImage ? (
//                     <Image
//                         source={{ uri: selectedImage }}
//                         style={styles.image}
//                     />
//                 ) : (
//                     <View style={styles.imagePlaceholder}>
//                         <FontAwesome name="file-image-o" size={80} color="#ced4da" />
//                         <Text style={styles.placeholderText}>Aucune image sélectionnée</Text>
//                     </View>
//                 )}
//
//                 {isLoading && (
//                     <View style={styles.progressContainer}>
//                         <View style={styles.progressBar}>
//                             <View style={[styles.progressFill, { width: `${progress}%` }]} />
//                         </View>
//                         <Text style={styles.progressText}>{progress}%</Text>
//                     </View>
//                 )}
//             </View>
//
//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity
//                     style={[styles.button, isLoading && styles.buttonDisabled]}
//                     onPress={pickImage}
//                     disabled={isLoading}
//                 >
//                     <LinearGradient
//                         colors={['#4e54c8', '#8f94fb']}
//                         style={styles.gradientButton}
//                         start={{ x: 0, y: 0 }}
//                         end={{ x: 1, y: 1 }}
//                     >
//                         {isLoading ? (
//                             <ActivityIndicator color="#fff" size="small" />
//                         ) : (
//                             <MaterialIcons name="photo-library" size={24} color="white" />
//                         )}
//                         <Text style={styles.buttonText}>
//                             {isLoading ? 'Traitement en cours...' : 'Choisir une facture'}
//                         </Text>
//                     </LinearGradient>
//                 </TouchableOpacity>
//
//                 {selectedImage && (
//                     <TouchableOpacity
//                         style={styles.secondaryButton}
//                         onPress={() => setSelectedImage(null)}
//                         disabled={isLoading}
//                     >
//                         <Text style={styles.secondaryButtonText}>Changer d'image</Text>
//                     </TouchableOpacity>
//                 )}
//             </View>
//
//             <View style={styles.tipsContainer}>
//                 <Text style={styles.tipsTitle}>Conseils pour une meilleure extraction :</Text>
//                 <View style={styles.tipItem}>
//                     <MaterialIcons name="check" size={16} color="#4e54c8" />
//                     <Text style={styles.tipText}>Photographiez sous un bon éclairage</Text>
//                 </View>
//                 <View style={styles.tipItem}>
//                     <MaterialIcons name="check" size={16} color="#4e54c8" />
//                     <Text style={styles.tipText}>Cadrez bien toute la facture</Text>
//                 </View>
//                 <View style={styles.tipItem}>
//                     <MaterialIcons name="check" size={16} color="#4e54c8" />
//                     <Text style={styles.tipText}>Évitez les reflets et ombres</Text>
//                 </View>
//             </View>
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 24,
//         backgroundColor: '#fff',
//     },
//     header: {
//         marginBottom: 32,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: '700',
//         color: '#343a40',
//         marginBottom: 8,
//     },
//     subtitle: {
//         fontSize: 16,
//         color: '#6c757d',
//     },
//     imageContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         marginBottom: 24,
//     },
//     image: {
//         width: '100%',
//         height: '70%',
//         borderRadius: 12,
//         resizeMode: 'contain',
//         borderWidth: 1,
//         borderColor: '#e9ecef',
//     },
//     imagePlaceholder: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 40,
//         borderWidth: 2,
//         borderColor: '#e9ecef',
//         borderStyle: 'dashed',
//         borderRadius: 12,
//     },
//     placeholderText: {
//         marginTop: 16,
//         color: '#adb5bd',
//         fontSize: 16,
//     },
//     progressContainer: {
//         marginTop: 16,
//         alignItems: 'center',
//     },
//     progressBar: {
//         height: 6,
//         width: '100%',
//         backgroundColor: '#e9ecef',
//         borderRadius: 3,
//         overflow: 'hidden',
//     },
//     progressFill: {
//         height: '100%',
//         backgroundColor: '#4e54c8',
//     },
//     progressText: {
//         marginTop: 8,
//         color: '#495057',
//         fontSize: 14,
//     },
//     buttonContainer: {
//         marginBottom: 24,
//     },
//     button: {
//         borderRadius: 12,
//         overflow: 'hidden',
//         elevation: 3,
//     },
//     buttonDisabled: {
//         opacity: 0.7,
//     },
//     gradientButton: {
//         padding: 16,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: '600',
//         marginLeft: 12,
//     },
//     secondaryButton: {
//         marginTop: 16,
//         alignItems: 'center',
//     },
//     secondaryButtonText: {
//         color: '#4e54c8',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     tipsContainer: {
//         padding: 16,
//         backgroundColor: '#f8f9fa',
//         borderRadius: 12,
//     },
//     tipsTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#343a40',
//         marginBottom: 12,
//     },
//     tipItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 8,
//     },
//     tipText: {
//         marginLeft: 8,
//         color: '#495057',
//     },
// });