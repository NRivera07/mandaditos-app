import { Text, View } from 'react-native';

export default function Orders() {
  const pedidos = [
    { id: '1', descripcion: 'Comprar medicina' },
  ];

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        Mis pedidos
      </Text>

      {pedidos.map((p) => (
        <View key={p.id} style={{ marginTop: 15 }}>
          <Text>{p.descripcion}</Text>
        </View>
      ))}
    </View>
  );
}