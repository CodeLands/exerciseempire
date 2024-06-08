import { Link, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

/*   const storeToken = async (value: string) => {
    try {
      await AsyncStorage.setItem('tempToken', value);
      console.log('Temp Token saved:', value);
    } catch (e) {
      console.error('Error saving token:', e);
    }
  }; */

  async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }

  const handleLogin = async () => {
    if (process.env.IS_PRODUCTION === 'false') {
      return router.push('/home');
    }

    if (!email || !password) {
      console.error('Email and password are required');
      return;
    }
    const api = process.env.EXPO_PUBLIC_API_URL
    if (!api) {
      console.error('No API URL found');
      return;
    }

    const route = api + "/login/";
    console.log('Sending request to: ', route);
    try {
    const result = await fetch(route, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    })
    const data = await result.json();
    console.log(data);

    if (data.success) {
      const tempToken = data.data.token;
      save('tempTokenSavedAt', Date.now().toString());
      save('tempToken', tempToken);
      console.log('Token saved:', tempToken);
      if (data.data.has2FA)
        router.replace('/faceIdLogin');
      else
        router.replace('/faceIdRegister');
    } else {
      console.error('Login failed:', data.message);
    }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Login:</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={(value) => setEmail(value)} value={email} />
      <TextInput style={styles.input} placeholder="Password" onChangeText={(value) => setPassword(value)} value={password} />

        <Pressable onPress={handleLogin}>
          <Text style={styles.mainButton}>Login</Text>
        </Pressable>
        <Link href="/register" asChild>
        <Pressable style={styles.sideButton}>
          <Text>To Register</Text>
        </Pressable>
      </Link>
      {/* <Link href="/faceIdLogin" asChild>
        <Pressable style={styles.sideButton}>
          <Text>To FaceLogin</Text>
        </Pressable>
      </Link> */}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    minWidth: 200,
  },
  mainButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  sideButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    color: 'white',
    borderWidth: 1,
  },
});
