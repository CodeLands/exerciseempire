import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, Tabs, router } from 'expo-router'
import { FontAwesome6, Fontisto, MaterialIcons } from '@expo/vector-icons'

export default function TabsLayout() {
  return (
    <Tabs
    screenOptions={({ route }) => ({
      tabBarStyle: {
        display: route.name === 'example' ? 'none' : 'flex',
      },
    })}
    >
      <Tabs.Screen name="welcome" options={{
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => (
          <Fontisto name="info" color={color} size={18} />
        )
        }} />
      <Tabs.Screen name="login" options={{
        headerShown: false,
        title: "Login",
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name={"login"} color={color} size={18} /> 
        ),
        }}
      />
      <Tabs.Screen name="register" options={{
        headerShown: false,
        title: "Register",
        tabBarIcon: ({ focused, color, size }) => (
          <FontAwesome6 name={"user-pen"} color={color} size={18} />
        ) 
       }}  />
    </Tabs>
  )
}

const styles = StyleSheet.create({})