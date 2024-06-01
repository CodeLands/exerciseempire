import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'
import { FontAwesome6, Fontisto, MaterialIcons } from '@expo/vector-icons'

export default function TabsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerShown: false,
        }} />
    </Stack>
  )
}

const styles = StyleSheet.create({})