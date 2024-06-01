import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CameraScreen from '@/sensors/camera'

export default function FaceIdLoginScreen() {
  return (
    
    <CameraScreen mode="videoOnly" facing="front" videoLength={2} />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})