import { StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{
        headerShown: false,
        title: 'Home',
        }} />
      <Tabs.Screen name="(activities)" options={{
        headerShown: false,
        title: 'Activities',
        }} />
      <Tabs.Screen name="lastActivity/[id]" options={{
        }} />
    </Tabs>
  )
}
 
const styles = StyleSheet.create({})