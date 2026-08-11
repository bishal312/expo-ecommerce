import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Modal, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { server, useApp } from '../context/AppContext';
import axios from 'axios';
import Toast from 'react-native-toast-message';

interface Order {
  _id: string;
  user: { email: string };
  status: "Pending" | "Shipped" | "Delivered";
  items: any[];
  subTotal: number;
  method: string;
  address: string;
  phone?: string;
  createdAt: string;
}

const STATUS = {
  Pending: {
    color: "text-amber-500",
    emoji: "🕐", bg: "bg-amber-50",
    border: "border-amber-200"
  },
  Shipped: {
    color: "text-sky-500",
    emoji: "🚚",
    bg: "bg-sky-50",
    border: "border-sky-200"
  },
  Delivered: {
    color: "text-green-500",
    emoji: "✅",
    bg: "bg-green-50",
    border: "border-green-200"
  },
};

export default function AdminOrder() {
  const { token } = useApp();
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/order/admin/all`,
        {
          headers: { token }
        }
      );
      setOrders(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false)

    }
  }

  useEffect(() => {
    fetchOrders()
  }, [token]);

  async function updateStatus(orderId: string, status: string) {
    setUpdating(true);
    try {
      const { data } = await axios.post(`${server}/api/order/${orderId}`,
        {
          status
        },
        {
          headers: {
            token
          },
        }
      );
      Toast.show({ type: "success", text1: data.message });
      await fetchOrders();
      setSelected(null);
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to update" });
    } finally {
      setUpdating(false);
    }
  }

  const filtered = orders.filter(
    (o) =>
      o.user?.email?.toLowerCase()?.includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.toString().includes(search)
  );

  return (
    <View className='flex-1'>
      <View className='px-4 pt-3 pb-2'>
        <View className='bg-white flex-row items-center border border-gray-200 rounded-2xl px-4 shadow-sm'>
          <Text className='text-gray-400 mr-2'>
            🔍
          </Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="search orders..."
            placeholderTextColor={"9ca3af"}
            className='flex-1 py-3 text-gray-800 text-sm'
          />
          {
            search.length > 0 && <TouchableOpacity onPress={() => setSearch("")}>
              <Text className='text-gray-400'>
                X
              </Text>
            </TouchableOpacity>
          }
        </View>
      </View>
      {
        loading ? <ActivityIndicator className='flex-1' color={"#9ea5e9"} size={"large"} /> :
          <FlatList data={filtered} keyExtractor={(item) => item._id} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, }} ListEmptyComponent={
            <View className='items-center py-16'>
              <Text className='text-4xl mb-2'>📦</Text>
              <Text className='text-gray-400'>No orders found</Text>

            </View>
          }
            renderItem={({ item }) => {
              const s = STATUS[item.status] ?? STATUS.Pending;
              return (
                <TouchableOpacity onPress={() => setSelected(item)}
                  className='bg-white rounded-3xl p-4 mb-3 shadow-sm border border-gray-100'>
                  <View className='flex-row items-start justify-between mb-2'>
                    <View className='flex-row items-start justify-between mb-2'>

                      <View className='flex-1 mr-3'>
                        <Text className='text-gray-900 font-semibold text-sm' numberOfLines={1}>
                          {item.user?.email}
                        </Text>
                        <Text className='text-gray-400 text-xs mt-0.5'>
                          #{item._id.slice(-10)}
                        </Text>
                      </View>
                      <View className={`px-3 py-3 rounded-full border ${s.bg} ${s.color}`}>
                        <Text className={`text-xs font-bold ${s.color}`}>
                          {s.emoji} {item.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className='flex-row justify-between mt-1'>
                    <Text className='text-gray-500 text-xs'>
                      📞 {item.phone}
                    </Text>
                    <Text className='text-orange-400 text-xs'>
                      ${item.subTotal}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            }}
          />

      }

      <Modal visible={!!selected} animationType='slide'
        transparent>
        <View className='flex-1 bg-black/40 justify-end'>
          <View className='bg-white rounded-t-3xl max-h-[80%]'>
            <View className='flex-row items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100'>
              <Text className='text-lg font-bold text-gray-900'>
                Order Details
              </Text>
              <TouchableOpacity onPress={() => setSelected(null)} className='bg-gray-100 w-8 h-8 rounded-xl items-center justify-center'>
                <Text className='text-gray-500'>
                  X
                </Text>
              </TouchableOpacity>
            </View>

            {selected && <ScrollView
              contentContainerStyle={{ padding: 20 }}>
              {
                [
                  ["Order Id", selected._id],
                  ["Customer", selected.user?.email],
                  ["Total", selected.subTotal],
                  ["Method", selected.method],
                  ["Phone", selected.phone],
                  ["Address", selected.address],
                ].map(([label, value]) => (
                  <View key={label} className='flex-row justify-between py-2.5 border-b border-gray-100'>
                    <Text className='text-gray-400 text-sm'>
                      {label}
                    </Text>
                    <Text className='text-gray-800 text-sm font-medium text-right flex-shrink ml-4' numberOfLines={2}>
                      {value}
                    </Text>
                  </View>
                ))
              }
              <Text className='text-gray-500 text-xs font-semibold uppercase mt05 mb-3'>
                Update Status
              </Text>
              <View className='flex-row gap-2'>
                {
                  (["Pending", "Shipped", "Delivered"] as const).map((status) => {
                    const s = STATUS[status];
                    const active = selected.status === status;
                    return (
                      <TouchableOpacity key={status} onPress={() => updateStatus(selected._id, status)}
                        disabled={updating || active}
                        className={`flex-1 py-3 rounded-2xl border items-center ${active ? `${s.bg} ${s.border}` : "bg-gray-50 border-gray-200"}`}>
                        {
                          updating && active ? <ActivityIndicator color={"#0ea5e9"} size={"small"} />
                            : <Text className={`text-xs font-bold ${active ? s.color : "text-gray-500"}`}>
                              {s.emoji}
                              {status}
                            </Text>
                        }
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
            </ScrollView>
            }
          </View>
        </View>
      </Modal>
    </View>
  )
}