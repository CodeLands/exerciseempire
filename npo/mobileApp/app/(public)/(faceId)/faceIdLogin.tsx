import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CameraScreen from '@/sensors/camera'
import FaceIdCapturedScreen, { AuthMode } from '@/features/faceId/faceIdCaptured'

export default function FaceIdLoginScreen() {
  const [wasFaceIdCaptured, setWasFaceIdCaptured] = React.useState(false)
  const [video, setVideo] = React.useState<string | null>(null)


  function onCapturedVideo(capturedVideo: string) {
    if (!capturedVideo || capturedVideo.length == 0) {
      console.log("No Video Captured...");
      return
    }
    setVideo(capturedVideo)
    setWasFaceIdCaptured(true)
  }
 
  return (
    <>
    {wasFaceIdCaptured ?
      <FaceIdCapturedScreen authMode={AuthMode.Login} video={video} />
      :
      <CameraScreen mode="videoOnly" facing="front" videoLength={3} onCapturedVideo={onCapturedVideo} />
    }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})