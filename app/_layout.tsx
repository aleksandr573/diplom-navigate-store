import { Stack } from 'expo-router';
import { AuthProvider } from '../components/AuthProvider';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: true }} />
    </AuthProvider>
  );
}
