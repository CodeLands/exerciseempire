import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'

export default function ActivityPage() {
  const { id } = useLocalSearchParams()
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: `Activity Details #${id}` }} />
      <Text>Activity Details for: {id}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
