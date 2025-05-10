import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';
import { API_URL } from '@/constants/config';

export default function ScanScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef<Camera>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    Nous avons besoin de votre autorisation pour utiliser la caméra
                </Text>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={async () => {
                        const { status } = await Camera.requestCameraPermissionsAsync();
                        setHasPermission(status === 'granted');
                    }}
                >
                    <Text style={styles.permissionButtonText}>Autoriser la caméra</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const processAndUploadImage = async (uri: string) => {
        try {
            setLoading(true);

            const processedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1200 } }],
                {
                    compress: 0.8,
                    format: ImageManipulator.SaveFormat.JPEG,
                }
            );

            await uploadImage(processedImage.uri);
        } catch (error) {
            console.error('Image processing error:', error);
            await uploadImage(uri);
        } finally {
            setLoading(false);
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
                headers: { 'Content-Type': 'multipart/form-data' },
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

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    skipProcessing: true,
                });
                setScanned(true);
                setIsActive(false);
                await processAndUploadImage(photo.uri);
            } catch (error) {
                console.error('Error taking picture:', error);
                Alert.alert('Erreur', "Impossible de prendre la photo");
            }
        }
    };

    return (
        <View style={styles.container}>
            {isActive ? (
                <Camera
                    style={styles.camera}
                    type={Camera.Constants.Type.back}
                    ref={cameraRef}
                    ratio="16:9"
                >
                    <View style={styles.overlay}>
                        <View style={styles.scanFrame} />
                        <Text style={styles.scanText}>
                            Cadrez la facture dans le rectangle
                        </Text>

                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={takePicture}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <View style={styles.captureButtonInner} />
                            )}
                        </TouchableOpacity>
                    </View>
                </Camera>
            ) : (
                <View style={styles.cameraPlaceholder}>
                    <MaterialIcons name="camera" size={80} color={theme.colors.placeholder} />
                    <Text style={styles.placeholderText}>Caméra inactive</Text>
                </View>
            )}

            <View style={styles.footer}>
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

                {scanned && loading && (
                    <View style={styles.processingContainer}>
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                        <Text style={styles.processingText}>Traitement de la facture...</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
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
    camera: { flex: 1 },
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
        width: '80%',
        aspectRatio: 1,
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
    processingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        backgroundColor: `${theme.colors.primary}20`,
        borderRadius: theme.radius.md,
        marginTop: theme.spacing.md,
    },
    processingText: {
        ...theme.text.body,
        color: theme.colors.primary,
        marginLeft: theme.spacing.sm,
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
    captureButton: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary,
        borderWidth: 3,
        borderColor: 'white',
    },
});