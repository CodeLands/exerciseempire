import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="welcome" options={{ headerShown: false }} />
      <Tabs.Screen name="login" options={{ headerShown: false }} />
      <Tabs.Screen name="register" options={{ headerShown: false }}  />
    </Tabs>
  )
}

const styles = StyleSheet.create({})