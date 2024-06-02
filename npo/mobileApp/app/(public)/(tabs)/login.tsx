import { Link, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (process.env.IS_PRODUCTION === 'false') {
      return router.push('/home');
    }

    if (!email || !password) {
      console.error('Email and password are required');
      return;
    }
    const api = process.env.EXPO_PUBLIC_API_URL;
    if (!api) {
      console.error('No API URL found');
      return;
    }

    fetch(api + "/login", {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Login:</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={(value) => setEmail(value)} value={email} />
      <TextInput style={styles.input} placeholder="Password" onChangeText={(value) => setPassword(value)} value={password} />
      <Link replace href="/home" asChild>
        <Pressable>
          <Text style={styles.mainButton}>Login (Go to Home)</Text>
        </Pressable>
      </Link>
        <Pressable onPress={handleLogin} style={styles.sideButton}>
          <Text>To Register</Text>
        </Pressable>
      <Link href="/faceIdLogin" asChild>
        <Pressable style={styles.sideButton}>
          <Text>To FaceLogin</Text>
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
