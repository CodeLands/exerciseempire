import { Link, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';


export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }
/*   const storeToken = async (value: string) => {
    try {
      await AsyncStorage.setItem('tempToken', value);
      console.log('Temp Token saved:', value);
    } catch (e) {
      console.error('Error saving token:', e);
    }
  }; */

  const handleRegister = async () => {
    if (process.env.IS_PRODUCTION === 'false') {
      return router.push('/home');
    }

    if (!email || !password || !confirmPassword) {
      console.error('Email, password and confirm password are required');
      return;
    }
    const api = process.env.EXPO_PUBLIC_API_URL;
    if (!api) {
      console.error('No API URL found');
      return;
    }

    const route = api + "/register/";
    console.log('Sending request to: ', route);
    try {
    const result = await fetch(route, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, repeatPassword: confirmPassword }),
    })
    const data = await result.json();
    console.log(data);

    if (data.success) {
      const tempToken = data.data.token;
      //storeToken(tempToken);
      save('tempToken', tempToken);
      console.log('Token saved:', tempToken);
      router.replace('/faceId');
      if (data.data.has2FA)
        router.replace('/faceIdLogin');
      else
        router.replace('/faceIdRegister');
    } else {
      console.error('Register failed:', data.message);
    }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Register:</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={(value) => setEmail(value)} value={email} />
      <TextInput style={styles.input} placeholder="Password" onChangeText={(value) => setPassword(value)} value={password} />
      <TextInput style={styles.input} placeholder="Confirm Password" onChangeText={(value) => setConfirmPassword(value)} value={confirmPassword} />

        <Pressable onPress={handleRegister}>
          <Text style={styles.mainButton}>Register</Text>
        </Pressable>
      <Link href="/login" asChild>
        <Pressable style={styles.sideButton}>
          <Text>To Login</Text>
        </Pressable>
      </Link>
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
