import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import historyService from '../services/historyService';
import { HistoryRoute } from '../types/history';

export default function ProfileScreen() {
  const { token } = useAuth();
  const [history, setHistory] = useState<HistoryRoute[]>([]);

  useEffect(() => {
    if (token) {
      historyService.getHistory(token).then(setHistory);
    }
  }, [token]);

  return (
    <View style={{ padding: 16 }}>
      <Text>История маршрутов:</Text>
      <FlatList
        data={history}
        keyExtractor={(r) => r.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.storeName} — {new Date(item.date).toLocaleString()}</Text>
            <Text>Товары: {item.items.join(', ')}</Text>
          </View>
        )}
      />
    </View>
  );
}
