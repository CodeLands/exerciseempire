import { Link } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';

export default function RegisterScreen() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Register:</Text>
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Password" />
      <TextInput style={styles.input} placeholder="Confirm Password" />
      <Link replace href="/home" asChild>
        <Pressable>
          <Text style={styles.mainButton}>Register (Go to Home)</Text>
        </Pressable>
      </Link>
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
