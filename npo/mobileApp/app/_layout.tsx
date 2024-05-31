import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
       <Stack.Screen name="index" />
      <Stack.Screen name="(public)" options={{ headerShown: false }}  />
      <Stack.Screen name="(private)" options={{ headerShown: false }}  />
    </Stack>
  );
}
