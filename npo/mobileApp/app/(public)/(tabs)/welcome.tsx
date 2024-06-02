import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome in Exercise Empire Mobile App...</Text>
      <Text style={styles.listTitle}>Here you can:</Text>
      <Text style={styles.listItem}>- Track your exercises</Text>
      <Text style={styles.listItem}>- Track your progress</Text>
      {/* <Text>- Get inspired by other users</Text>
      <Text>- Compete with others</Text>
      <Text>- Share your progress</Text> */}

      <Text style={styles.listTitle}>To get started:</Text>
      <Text style={styles.listItem}>- Create an account</Text>
      <Text style={styles.listItem}>- Log in</Text>
      <Text style={styles.listItem}>- Start tracking your exercises</Text>

    </View>
  )
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
    padding: 20,
    textAlign: 'center',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    marginTop: 25,
    textAlign: 'center',
  },
  listItem: {
    fontSize: 16,
    padding: 5,
    textAlign: 'center',
  }
});