import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { server, useApp } from '../../../context/AppContext';
import { Order } from '../../../types';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProtectedRoutes from '../../../components/ProtectedRoutes';

const statusStyle: any = {
  Pending: { color: "text-amber-500", emoji: "🕐" },
  Shipped: { color: "text-sky-500", emoji: "🚚" },
  Delivered: { color: "text-green-500", emoji: "✅" },
}

export default function OrdersScreen() {
  const router = useRouter();
  const { token, isAuth } = useApp();
  const [orders, setOrder] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const { data } = await axios.get(`${server}/api/order/all`,
        {
          headers: { token },
        }
      );
      setOrder(data.orders ?? []);
    } catch (error: any) {
      Toast.show({ type: "error", text1: error.respones?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [token]);
  return (
    <ProtectedRoutes isLoggedIn={isAuth}>
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-row items-center px-5 py-4'>
          <TouchableOpacity className='mr-3 bg-white border border-gray-200 w-9 h-9 rounded-xl items-center justify-center shadow-sm' onPress={() => router.push("/account")}>
            <Text className='text-gray-600 text-xl font-bold'>⬅️</Text>
          </TouchableOpacity>

          <Text className='text-xl font-bold text-gray-900 flex-1'>
            My Orders
          </Text>
        </View>

        {
          loading && orders.length === 0 ? (<ActivityIndicator
            color={"#0ea5e9"} size={"large"} />) : orders.length === 0 ? (
              <View className='flex-1 items-center justify-center px-8'>
                <Text className='text-6xl mb-4'>👜</Text>
                <Text className='text-gray-900 text-xl font-bold mb-2'>
                  No Orders yet
                </Text>
                <Text className='text-gray-400 text-sm text-center mb-6'>
                  You haven't placed any orders yet.
                </Text>
                <TouchableOpacity onPress={() => router.replace("/(tabs)/home")} className='bg-sky-500 px-8 py-3 rounded-2xl'>
                  <Text className='text-white font-bold'>
                    Shop now
                  </Text>
                </TouchableOpacity>
              </View>) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={fetchOrders}
                  tintColor={"#0ea5e9"} />
              }
              renderItem={({ item }) => {
                const s = statusStyle[item.status] ?? {
                  color: "text-gray-500",
                  emoji: "📦"
                };
                return (
                  <TouchableOpacity onPress={() => router.push({
                    pathname: "/order/[id]",
                    params: { id: item._id },
                  })}
                    className='bg-white rounded-3xl p-4 shadow-sm border border-gray-100'>
                    <View className='flex-row items-center justify-between mb-3'>
                      <Text className='text-gray-400 text-xs'>
                        #{item._id.slice(-10).toUpperCase()}
                      </Text>
                      <Text className={`text-xs font-bold ${s.color}`}>
                        {s.emoji} {item.status}
                      </Text>
                    </View>

                    <View className='h-px bg-gray-100 mb-3' />

                    <View className='flex-row justify-between'>
                      {[
                        ["items", item.items?.length ?? 0],
                        ["Total", `$${item.subTotal}`],
                        ["payment", item.method.toUpperCase()],
                        ["Date", new Date(item.createdAt).toLocaleDateString("en-NP", {
                          day: "numeric",
                          month: "short",
                        })]
                      ].map(([label, value]) => (
                        <View key={label}>
                          <Text className='text-gray-400 text-xs'>
                            {label}
                          </Text>
                          <Text className='text-gray-900] font-semibold text-sm mt-0.5'>
                            {value}
                          </Text>
                        </View>
                      ))}
                    </View>
                    <Text className='text-sky-500 text-xs font-semibold text-right mt-3'> View Details</Text>
                  </TouchableOpacity>
                )
              }}
            />
          )
        }
      </SafeAreaView>
    </ProtectedRoutes>
  )
}