import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function FaceIdRegisterScreen() {
  return (
    <View style={styles.container}>
      <Text>Face ID: Register</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})