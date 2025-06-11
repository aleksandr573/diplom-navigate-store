import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import storeService from '../services/storeService';
import { Store } from '../types/store';

export default function StoresScreen() {
  const [stores, setStores] = useState<Store[]>([]);
  const router = useRouter();

  useEffect(() => {
    storeService.getStores().then(setStores);
  }, []);

  return (
    <View style={{ padding: 16 }}>
      <Text>Выберите магазин:</Text>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Button title={item.name} onPress={() => router.push(`/route?storeId=${item.id}`)} />
        )}
      />
    </View>
  );
}
