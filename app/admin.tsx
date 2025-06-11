import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  InteractionManager,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../components/AuthProvider';
import productService from '../services/productService';
import storeService from '../services/storeService';
import { Product } from '../types/product';
import { Store } from '../types/store';

export default function AdminScreen() {
  const { token, role } = useAuth();
  const router = useRouter();

  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ x: '', y: '', shelf: '' });

  // ✅ Безопасная навигация после монтирования
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      if (!token) {
        router.replace('/login');
      } else if (role !== 'admin') {
        alert('Доступ запрещён. Только для администраторов.');
        router.replace('/');
      }
    });
    return () => task.cancel();
  }, [token, role]);

  useEffect(() => {
    storeService.getStores().then(setStores);
  }, []);

  useEffect(() => {
    if (selectedStore) {
      productService.getProductsByStore(selectedStore).then(setProducts);
    }
  }, [selectedStore]);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditData({
      x: String(product.x),
      y: String(product.y),
      shelf: product.shelf,
    });
  };

  const saveEdit = async () => {
    if (!token || editingId === null) return;

    const updated = {
      x: parseInt(editData.x),
      y: parseInt(editData.y),
      shelf: editData.shelf,
    };

    const res = await productService.updateProduct(editingId, updated, token);
    setProducts((prev) => prev.map((p) => (p.id === editingId ? res : p)));
    setEditingId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Админ-панель: выбор магазина</Text>
      <FlatList
        data={stores}
        keyExtractor={(s) => s.id.toString()}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.storeButton,
              selectedStore === item.id && styles.selectedStore,
            ]}
            onPress={() => setSelectedStore(item.id)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedStore && (
        <>
          <Text style={styles.subtitle}>Товары:</Text>
          <FlatList
            data={products}
            keyExtractor={(p) => p.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.product}>
                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                {editingId === item.id ? (
                  <>
                    <TextInput
                      placeholder="X"
                      keyboardType="numeric"
                      value={editData.x}
                      onChangeText={(x) => setEditData((d) => ({ ...d, x }))}
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="Y"
                      keyboardType="numeric"
                      value={editData.y}
                      onChangeText={(y) => setEditData((d) => ({ ...d, y }))}
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="Полка"
                      value={editData.shelf}
                      onChangeText={(shelf) => setEditData((d) => ({ ...d, shelf }))}
                      style={styles.input}
                    />
                    <Button title="Сохранить" onPress={saveEdit} />
                  </>
                ) : (
                  <>
                    <Text>Полка: {item.shelf}</Text>
                    <Text>Координаты: ({item.x}, {item.y})</Text>
                    <Button title="Изменить" onPress={() => handleEdit(item)} />
                  </>
                )}
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginVertical: 10 },
  storeButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 6,
    marginRight: 8,
  },
  selectedStore: { backgroundColor: '#aaf' },
  product: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 6,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 6,
    marginVertical: 4,
    borderRadius: 4,
  },
});
