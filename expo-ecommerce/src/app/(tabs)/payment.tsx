import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { server, useApp } from '../../../context/AppContext';
import { Addresses, CartItem } from '../../../types';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProtectedRoutes from '../../../components/ProtectedRoutes';


export default function PaymentScreen() {
  const router = useRouter()
  const { addressId } = useLocalSearchParams<{ addressId: string }>();
  const { token, cart, fetchCart, isAuth } = useApp();

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
    })();
  }, [addressId]);

  async function handlePlaceOrder() {
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

  if (loading) {
    return <ActivityIndicator className='flex-1' color={"#0ea5e9"} size={"large"} />
  }

  return (
    <ProtectedRoutes isLoggedIn={isAuth}>
      <SafeAreaView className='flex-1 bg-gray-50 '>
        <View className='flex-row items-center px-5 py-4'>
          <TouchableOpacity className='mr-3 bg-white border border-gray-200 w-9 h-9 rounded-xl items-center justify-center shadow-sm' onPress={() => router.push("/checkout")}>
            <Text className='text-gray-600 font-bold'>
              ⬅️
            </Text>
          </TouchableOpacity>
          <Text className='text-xl font-bold text-gray-900 flex-1'>
            Review Order
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}>
          <View className='bg-white rounded-3xl overflow-hidden shadow-sm border-gray-100'>
            <Text className='text-gray-900 font-bold px-4 pt-4 pb-2'>
              Order Items ({totalItems};)
            </Text>
            {
              cart.map((item: CartItem) => (
                <View
                  key={item._id}
                  className='flex-row items-center px-4 py-3 border-t border-gray-100'
                >
                  <View className="w-12 h-12 rounded-2xl bg-gray-50 overflow-hidden mr-3">
                    <Image source={{ uri: item.product?.images?.[0]?.url }} className='w-full h-full' resizeMode='contain' />
                  </View>

                  <View className='flex-1'>
                    <Text className='text-gray-900 font-semibold text-sm' numberOfLines={1}>
                      {item.product.title}
                    </Text>
                    <Text className='text-xs'>
                      ${item.product?.price} X {item.quauntity}
                    </Text>
                  </View>
                  <Text className='text-orange-500 font-bold text-sm'>
                    ${item.product?.price * item.quauntity}
                  </Text>
                </View>
              ))
            }
            <View className='flex-row justify-between px-4 py-3 border-t border-gray-100'>
              <Text className='text-gray-500'> Total</Text>
              <Text className='text-gray-900 font-bold text-base'>
                ${total}
              </Text>
            </View>
          </View>

          {
            address && (
              <View className='bg-white rounded-3xl p-4 shadow-sm border border-gray-100'>
                <Text className='text-gray-900 font-bold mb-2'>
                  Delivery Address
                </Text>
                <Text className='text-gray-700 text-sm'>{address.address}</Text>
                <Text className='text-gray-700 text-xs mt-1'>📞{address.phone}</Text>
              </View>
            )
          }

          <View className='bg-white rounded-3xl p-4 shadow-sm border border-gray-100'>
            <Text className='text-gray-900 font-bold mb-2'>
              Payment Method
            </Text>
            <View className='flex-row items-center p-4 rounded-2xl border border-sky-500 bg-sky-50'>
              <Text className='text-2xl mr-3'>
                💵
              </Text>
              <Text className='text-sky-600 font-semibold text-sm'>
                Cash on Delivery
              </Text>
              <Text className='text-gray-400 text-xs mt-0.5 ml-2'>
                Pay when your order arrives
              </Text>
            </View>
          </View>

          <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 shadow-lg'>
            <View className='flex-row justify-between mb-3'>
              <Text className='text-gray-400 text-sm'>
                {
                  totalItems
                } Items • Cash on Delivery
              </Text>
              <Text className='text-gray-900 font-bold'>
                $ {total}
              </Text>
            </View>
            <TouchableOpacity onPress={handlePlaceOrder} disabled={!address || placing} className={`py-4 rounded-2xl ${!address || placing ? "bg-gray-200" : "bg-sky-500"}`}>
              {placing ? <ActivityIndicator color={"white"} size={"small"} />
                : <Text className='text-white text-center font-bold text-base'>
                  Place Order
                </Text>
              }
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoutes>
  )
}