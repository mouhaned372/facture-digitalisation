import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Camera from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function ScanScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const cameraRef = useRef<Camera.Camera>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (!cameraRef.current || !cameraReady) return;

        setLoading(true);
        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                base64: true
            });

            const formData = new FormData();
            formData.append('image', {
                uri: photo.uri,
                name: 'invoice.jpg',
                type: 'image/jpeg',
            });

            const response = await axios.post('YOUR_API_ENDPOINT', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Alert.alert('Succès', 'Facture analysée avec succès');
            console.log('Données extraites:', response.data);

        } catch (error) {
            Alert.alert('Erreur', "Échec de l'analyse de la facture");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return (
            <View style={styles.permissionContainer}>
                <Text>Autorisation caméra requise</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                        const { status } = await Camera.requestCameraPermissionsAsync();
                        setHasPermission(status === 'granted');
                    }}
                >
                    <Text>Autoriser</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera.Camera
                style={styles.camera}
                ref={cameraRef}
                type={Camera.Camera.Constants.Type.back}
                onCameraReady={() => setCameraReady(true)}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanFrame} />
                    <Text style={styles.scanText}>Cadrez votre facture</Text>
                </View>
            </Camera.Camera>

            <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                disabled={loading || !cameraReady}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <View style={styles.captureCircle} />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        padding: 15,
        backgroundColor: '#2196F3',
        borderRadius: 10,
        marginTop: 20
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    scanFrame: {
        width: '80%',
        height: '50%',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10
    },
    scanText: {
        color: 'white',
        marginTop: 20,
        fontSize: 16
    },
    captureButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    captureCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'red'
    }
});