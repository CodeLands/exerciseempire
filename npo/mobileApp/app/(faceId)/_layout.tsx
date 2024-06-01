import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
        <Stack.Screen name="faceIdLogin" options={{
            title: 'Face ID: Login',
            headerShown: true,
        }}/>
        <Stack.Screen name="faceIdRegister" options={{
            title: 'Face ID: Register',
            headerShown: true,
        }}/>
    </Stack>
  );
}
