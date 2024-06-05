import { ActivityIndicator, StyleSheet, Text, View,  } from 'react-native'
import React, { useEffect } from 'react'
import { Octicons } from '@expo/vector-icons'
import { router } from 'expo-router'

export enum AuthMode {
    Login = 'Login',
    Register = 'Register',
}

type FaceIdCapturedProps = {
    video: string | null,
    authMode: AuthMode,
}

enum Status {
    Uploading = 'Authenticating...',
    Success = 'Success',
    Failed = 'Failed',
}

export default function FaceIdCapturedScreen(props: FaceIdCapturedProps) {
    const [status, setStatus] = React.useState<Status>(Status.Uploading)

    useEffect(() => {
        console.log('Face ID Captured: ', { video: props.video })
        if (props.video) {
            setTimeout(() => {
                setStatus(Status.Success)

                setTimeout(() => {
                    router.replace('/home')
                }, 1000)
            }, 2000)
        } else {
            setStatus(Status.Failed)
        }
    }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Face ID - {props.authMode}</Text>
      <Text style={styles.subtitle}>{status}</Text>

        {status === Status.Uploading && (
            <ActivityIndicator style={{
                marginTop: 20,
                transform: [{ scale: 2 }]
            }} size="large" color="#0000ff" />
        )}
        {status === Status.Success && (
            <Octicons name="shield-check" size={100} color="green" />  
        )}
        {status === Status.Failed && (
            <Octicons name="shield-x" size={100} color="green" />  
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
})