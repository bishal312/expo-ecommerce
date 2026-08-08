import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { server, useApp } from '../../../context/AppContext';
import { Addresses } from '../../../types';
import axios from 'axios';
import Toast from 'react-native-toast-message';

export default function PaymentScreen() {
  const router = useRouter()
  const { addressId } = useLocalSearchParams<{ addressId: string }>();
  const { token, cart, fetchCart } = useApp();

  const [address, setAddress] = useState<Addresses | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quauntity, 0
  );

  const totalItems = cart.reduce((s, i) => s + (i.quauntity ?? 0), 0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${server}/api/address/${addressId}`, {
          headers: { token }
        });
        setAddress(data);
      } catch (error: any) {
        Toast.show({ type: "error", text1: "Failed to get address!" });
      } finally {
        setLoading(false);
      }
    })
  }, [addressId]);

  async function handlePlace() {
    setPlacing(true);
    try {
      const { data } = await axios.post(`${server}/api/order/new/cod`, {
        method: "cod", phone: address!.phone, address: address!.address
      }, {
        headers: { token },
      });
      Toast.show({ type: "success", text1: data.message });
      await fetchCart();
      router.replace("/orders-success");
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Failded to create an order" });
    } finally {
      setPlacing(false);
    }
  }

  return (
    <View>
      <Text>PaymentScreen</Text>
    </View>
  )
}