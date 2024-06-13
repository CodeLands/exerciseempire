import { ActivityIndicator, Pressable, StyleSheet, Text, View,  } from 'react-native'
import React, { useEffect } from 'react'
import { Octicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export enum AuthMode {
    Login = 'Login',
    Register = 'Register',
}

type FaceIdCapturedProps = {
    video: string | null,
    authMode: AuthMode,
}

enum Status {
    SigningIn = 'Authenticating...',
    SigningUp = 'Registering...',
    Success = 'Success',
    Failed = 'Failed',
}

const api = process.env.EXPO_PUBLIC_API_URL

export default function FaceIdCapturedScreen(props: FaceIdCapturedProps) {
    const [status, setStatus] = React.useState<Status>(props.authMode === AuthMode.Login ? Status.SigningIn : Status.SigningUp)

    const fetchBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
    };

    const createFormData = async (uri: string): Promise<FormData> => {
        const formData = new FormData();
    
        const blob = await fetchBlob(uri);
    
        formData.append('video', {
        name: 'video.mp4',
        type: 'video/mp4',
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        blob,
        });
    
        return formData;
    };

    const sendVideoRequest = async (tempToken: string, videoUri: string, route: string, authMode: AuthMode) => {

    try {
        //const localUri = await getVideoFile(videoUri);
        console.log('Creating form data...')
        const formData = await createFormData(videoUri);

        console.log('Sending video data...')
        const response = await fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${tempToken}`,
        },
        body: formData,
        });
        console.log('Response: ', response);

        if (!response.ok) {
            console.error('Network response:', response);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Response data:', data);

        if (data.success) {
        setStatus(Status.Success)

        await SecureStore.setItemAsync('authToken', data.data.token)
        await SecureStore.setItemAsync('authTokenSavedAt', Date.now().toString())
        await SecureStore.deleteItemAsync('tempToken')
        await SecureStore.deleteItemAsync('tempTokenSavedAt')

        setTimeout(() => {
            if (authMode === AuthMode.Login) {
                router.replace('/home')
            } else {
                router.replace('/home')
                //router.replace('/faceIdLogin')
            }
        }, 1000)
        } else {
            setStatus(Status.Failed)

        if (authMode === AuthMode.Login) {
            console.error('FaceIdLogin Failed:', data.errors)
            setTimeout(() => {
                router.replace('/faceIdLogin')
            }, 1000)
        } else {
            console.error('FaceIdRegister Failed:', data.errors)
            setTimeout(() => {
                router.replace('/faceIdRegister')
            }, 1000)
        }
    }
    } catch (error) {
        console.error('Error sending video data', error);

        setStatus(Status.Failed)

        if (authMode === AuthMode.Login) {
            console.error('FaceIdLogin Failed:', error)
            setTimeout(() => {
                router.replace('/faceIdLogin')
            }, 1000)
        } else {
            console.error('FaceIdRegister Failed:', error)
            setTimeout(() => {
                router.replace('/faceIdRegister')
            }, 1000)
        }
    }
    };

    async function sendFaceAuthRequest(authMode: AuthMode) {
        let tempToken = await SecureStore.getItemAsync("tempToken");

        if (!api) {
            console.error('No API URL found');
            return; 
        }
        if (!tempToken) {
            console.error('No temp token found');
            router.replace('/login')
            return;
        }
        if (!props.video) {
            console.error('No video found');
            return;
        }
        
        let route = api
        if (authMode === AuthMode.Login) {
            route += "/face-login/";
            console.log('Logging in...')
            await sendVideoRequest(tempToken, props.video, route, AuthMode.Login)
        } else {
            route += "/face-register/";
            console.log('Registering...')
            await sendVideoRequest(tempToken, props.video, route, AuthMode.Register)
        }
    }


    useEffect(() => {
        const sendReq = async () => {
            console.log('Face ID Captured: ', props.video )
            if (!props.video) {
                console.error('No video found');
                setStatus(Status.Failed)
                setTimeout(() => {
                    if (props.authMode === AuthMode.Login) {
                        router.replace('/faceIdLogin')
                    } else {
                        router.replace('/faceIdRegister')
                    }
                }, 2000)
                return;
            }

            if (props.authMode === AuthMode.Login) {
                await sendFaceAuthRequest(AuthMode.Login)
            } else {
                await sendFaceAuthRequest(AuthMode.Register)
            }

            /* setTimeout(() => {
                setStatus(Status.Success)

                setTimeout(() => {
                    router.replace('/home')
                }, 1000)
            }, 2000) */
        }
        setTimeout(() =>
        sendReq()
        , 6000)
    }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Face ID - {props.authMode}</Text>
      <Text style={styles.subtitle}>{status}</Text>

        {status === Status.SigningIn || status === Status.SigningUp ? (
            <ActivityIndicator style={{
                marginTop: 20,
                transform: [{ scale: 2 }]
            }} size="large" color="#0000ff" />
        ) : null}
        {status === Status.Success && (
            <Octicons name="shield-check" size={100} color="green" />  
        )}
        {status === Status.Failed && (
            <>
                <Octicons name="shield-x" size={100} color="red" />  
                <Text style={styles.subtitle}>Sending failed, Errors: TODO</Text>
                <Text style={styles.subtitle}>How would you like to proceed?</Text>
                <Pressable style={styles.button} onPress={() => {
                    if (props.authMode === AuthMode.Login) {
                        router.replace('/faceIdLogin')
                    } else {
                        router.replace('/faceIdRegister')
                    }
                }}>
                    <Text>Try Again</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => {
                    router.replace('/login')
                }}>
                    <Text>Back to Login</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => {
                        // TODO: Reset Face ID
                }}>
                    <Text>Reset Face ID - TODO</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => {
                    router.replace('/welcome')
                }}>
                    <Text>Back to welcome</Text>
                </Pressable>
            </>
        )}
        
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
        },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        padding: 10,
        backgroundColor: 'lightblue',
        borderRadius: 5,
        marginTop: 10,
    },
})