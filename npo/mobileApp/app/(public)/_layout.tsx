import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}  />
      <Stack.Screen name="(faceId)/faceIdLogin" options={{ headerShown: false }}  />
    <Stack.Screen name="(faceId)/faceIdRegister" options={{ headerShown: false }}  />
    </Stack>
  );
}
