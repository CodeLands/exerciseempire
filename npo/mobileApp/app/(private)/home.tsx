import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>

      <Text style={styles.listTitle}>To get started:</Text>
      
      <Text style={styles.listItem}>- Check out our activities</Text>
      <Text style={styles.listItem}>- Look at their stats distribution</Text>
      <Text style={styles.listItem}>- Pick the one you like the most</Text>
      <Text style={styles.listItem}>- Start your activity</Text>
      <Text style={styles.listItem}>- While you are movin and groovin, we will track your progress</Text>

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