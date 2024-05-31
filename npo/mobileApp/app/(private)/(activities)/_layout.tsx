import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="activities" options={{
        headerShown: true, 
        headerTitle: 'Activities',
        }} />
      <Stack.Screen name="activity/[id]" options={{
        headerBackVisible: true
        }} />
    </Stack>
  )
}
 
const styles = StyleSheet.create({})