import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { uploadInvoice } from '../../hooks/useInvoices';

type CameraScreenProps = {
    onScanComplete?: () => void;
};

export default function CameraScreen({ onScanComplete }: CameraScreenProps) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameraRef, setCameraRef] = useState<Camera | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef) {
            setIsLoading(true);
            try {
                const photo = await cameraRef.takePictureAsync({ quality: 0.8 });

                const optimizedImage = await manipulateAsync(
                    photo.uri,
                    [{ resize: { width: 1000 } }],
                    { compress: 0.7, format: SaveFormat.JPEG }
                );

                await uploadInvoice(optimizedImage.uri);
                onScanComplete ? onScanComplete() : router.push('/invoices');
            } catch (error) {
                console.error('Error taking picture:', error);
                alert('Erreur lors du scan de la facture');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const pickImage = async () => {
        setIsLoading(true);
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
                await uploadInvoice(result.assets[0].uri);
                onScanComplete ? onScanComplete() : router.push('/invoices');
            }
        } catch (error) {
            console.error('Error picking image:', error);
            alert('Erreur lors de la sélection de la facture');
        } finally {
            setIsLoading(false);
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>Pas d'accès à la caméra</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                ref={ref => setCameraRef(ref)}
                type={CameraType.back}
            >
                <View style={styles.overlay}>
                    <View style={styles.overlayBorder} />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.galleryButton}
                        onPress={pickImage}
                        disabled={isLoading}
                    >
                        <Ionicons name="images" size={30} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takePicture}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <View style={styles.innerCaptureButton} />
                        )}
                    </TouchableOpacity>

                    <View style={styles.placeholder} />
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayBorder: {
        width: '80%',
        height: '60%',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCaptureButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    galleryButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: {
        width: 50,
    },
});