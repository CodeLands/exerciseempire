import { StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{
        headerShown: false,
        title: 'Home',
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={"home"} color={color} size={18} />
        ) 

        }} />
      <Tabs.Screen name="(activities)" options={{
        headerShown: false,
        title: 'Activities',
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name={"sports-kabaddi"} color={color} size={18} />
        )

        }} />
      <Tabs.Screen name="lastActivity/[id]" options={{
        headerShown: true,
        title: 'Last Activity',
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name={"sports-martial-arts"} color={color} size={18} />
        )

        }} />
    </Tabs>
  )
}
 
const styles = StyleSheet.create({})