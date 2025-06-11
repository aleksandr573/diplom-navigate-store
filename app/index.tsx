import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../components/AuthProvider';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout, role } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать в приложение!</Text>
      {user ? (
        <>
          <Button title="Магазины" onPress={() => router.push('/stores')} />
          <Button title="Профиль" onPress={() => router.push('/profile')} />
          {role === 'admin' && (
            <Button title="Админка" onPress={() => router.push('/admin')} />
          )}
          <Button title="Выйти" onPress={logout} />
        </>
      ) : (
        <>
          <Button title="Войти" onPress={() => router.push('/login')} />
          <Button title="Регистрация" onPress={() => router.push('/register')} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, padding: 16 },
  title: { fontSize: 20, marginBottom: 20 },
});
