import { Link, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
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

    fetch(api + "/register", {
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
      <Text style={styles.title}>Register:</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={(value) => setEmail(value)} value={email} />
      <TextInput style={styles.input} placeholder="Password" onChangeText={(value) => setPassword(value)} value={password} />
      <TextInput style={styles.input} placeholder="Confirm Password" onChangeText={(value) => setConfirmPassword(value)} value={confirmPassword} />

        <Pressable onPress={handleRegister}>
          <Text style={styles.mainButton}>Register (Go to Home)</Text>
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
