import { Stack } from 'expo-router';
export { ErrorBoundary } from 'expo-router';

export default function ProtectedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="pinCode" />
      <Stack.Screen name="home" />

      <Stack.Screen
        name="settings"
      />
    </Stack>
  );
}