import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import authService from '../services/authService';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await authService.register(email, password, role);
      alert('Регистрация успешна!');
      router.replace('/login');
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      alert('Ошибка регистрации. Возможно, пользователь уже существует.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Text style={styles.label}>Выберите роль:</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'user' && styles.selectedRole]}
          onPress={() => setRole('user')}
        >
          <Text>Пользователь</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'admin' && styles.selectedRole]}
          onPress={() => setRole('admin')}
        >
          <Text>Админ</Text>
        </TouchableOpacity>
      </View>
      <Button title="Зарегистрироваться" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
  },
  label: { marginTop: 10 },
  roleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  roleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
  },
  selectedRole: {
    backgroundColor: '#d0eaff',
    borderColor: '#007aff',
  },
});
