import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { useAuth } from '../components/AuthProvider';
import historyService from '../services/historyService';
import productService from '../services/productService';
import { Product } from '../types/product';

export default function RouteScreen() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (storeId) {
      productService.getProductsByStore(Number(storeId)).then(setProducts);
    }
  }, [storeId]);

  const toggleProduct = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSaveRoute = async () => {
    if (!token || selectedIds.length === 0) {
      alert('Выберите хотя бы один товар');
      return;
    }

    try {
      await historyService.saveRoute('Магазин', selectedIds, token);
      alert('Маршрут сохранён!');
    } catch (e) {
      console.error('Ошибка при сохранении маршрута:', e);
      alert('Не удалось сохранить маршрут.');
    }
  };

  function optimizeRoute(products: Product[]): Product[] {
    if (products.length === 0) return [];

    const visited: boolean[] = new Array(products.length).fill(false);
    const result: Product[] = [];

    let currentIndex = 0;
    result.push(products[currentIndex]);
    visited[currentIndex] = true;

    for (let step = 1; step < products.length; step++) {
      let nearestIndex = -1;
      let nearestDistance = Infinity;
      const current = products[currentIndex];

      for (let i = 0; i < products.length; i++) {
        if (!visited[i]) {
          const dx = products[i].x - current.x;
          const dy = products[i].y - current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < nearestDistance) {
            nearestDistance = dist;
            nearestIndex = i;
          }
        }
      }

      if (nearestIndex !== -1) {
        result.push(products[nearestIndex]);
        visited[nearestIndex] = true;
        currentIndex = nearestIndex;
      }
    }

    return result;
  }

  const selectedProducts = optimizeRoute(
    selectedIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[]
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Поиск товара"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
      <FlatList
        data={products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(p) => p.id.toString()}
        renderItem={({ item }) => (
          <Button
            title={`${item.name} (${item.shelf})`}
            color={selectedIds.includes(item.id) ? 'green' : undefined}
            onPress={() => toggleProduct(item.id)}
          />
        )}
      />
      <Button title="Сохранить маршрут" onPress={handleSaveRoute} />

      <Text style={styles.title}>Маршрут по магазину</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Svg height={400} width={350} style={{ backgroundColor: '#f8f8f8', marginTop: 10 }}>
          {(() => {
            const scale = 3;
            const points = selectedProducts.map((p) => ({
              x: p.x * scale,
              y: p.y * scale,
              id: p.id,
              name: p.name,
            }));

            if (points.length === 0) return null;

            const minX = Math.min(...points.map((p) => p.x));
            const minY = Math.min(...points.map((p) => p.y));
            const maxX = Math.max(...points.map((p) => p.x));
            const maxY = Math.max(...points.map((p) => p.y));

            const canvasWidth = 350;
            const canvasHeight = 400;

            const offsetX = (canvasWidth - (maxX - minX)) / 2 - minX;
            const offsetY = (canvasHeight - (maxY - minY)) / 2 - minY;

            return points.map((point, index) => {
              const cx = point.x + offsetX;
              const cy = point.y + offsetY;
              const prev = points[index - 1];
              const prevCx = prev ? prev.x + offsetX : 0;
              const prevCy = prev ? prev.y + offsetY : 0;

              return (
                <React.Fragment key={point.id}>
                  <Circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill={
                      index === 0
                        ? 'green'
                        : index === points.length - 1
                        ? 'red'
                        : 'blue'
                    }
                  />
                  <SvgText x={cx + 8} y={cy - 8} fontSize="12" fill="black">
                    {point.name}
                  </SvgText>
                  {index > 0 && (
                    <Line
                      x1={prevCx}
                      y1={prevCy}
                      x2={cx}
                      y2={cy}
                      stroke="red"
                      strokeWidth={2}
                    />
                  )}
                </React.Fragment>
              );
            });
          })()}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
});
