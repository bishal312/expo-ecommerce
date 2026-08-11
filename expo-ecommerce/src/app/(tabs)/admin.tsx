import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import { useApp } from '../../../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminOrder from '../../../components/AdminOrder';
import AdminProducts from '../../../components/AdminProducts';
import AdminStats from '../../../components/AdminStats';

type Tab = "products" | "orders" | "stats";
const TABS: { key: Tab; label: string, emoji: string }[] = [
  { key: "products", label: "Product", emoji: "📦" },
  { key: "orders", label: "Orders", emoji: "🛍️" },
  { key: "stats", label: "Stats", emoji: "📊" },
]

export default function AdminScreen() {
  const router = useRouter();
  const { user, isAuth } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>(
    "products"
  );

  useEffect(() => {
    if (!isAuth || !user || user.role !== "admin") {
      router.replace("/(tabs)/home");
    }
  }, [isAuth, user, router])

  if (!user || user.role !== "admin") {
    return null;
  };
  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='flex-row items-center px-5 py-4'>
        <TouchableOpacity className='mr-3 bg-white border border-gray-200 w-9 h-9 rounded-xl items-center justify-center shadow-sm' onPress={() => router.push("/account")}>
          <Text className='text-gray-600 text-xl font-bold'>
            ⬅️
          </Text>
        </TouchableOpacity>
        <Text className='text-xl font-bold text-gray-900 flex-1'>
          Admin Dashboard
        </Text>
      </View>

      <View className='flex-1'>
        {activeTab === "products" &&
          <AdminProducts />
        }
        {
          activeTab === "orders" && <AdminOrder />
        }
        {
          activeTab === "stats" && <AdminStats />
        }
      </View>

      <View className='flex-row bg-white border-t border-gray-100 pb-2 pt-1'>
        {
          TABS.map(({ key, label, emoji }) => (
            <TouchableOpacity key={key} onPress={() => setActiveTab(key)} className='flex-1 items-center py-1'>
              <Text className='text-xl mb-0.5'>
                {emoji}
              </Text>
              <Text className={`text-xs font-semibold px-1 ${activeTab === key ? "text-sky-500" : "text-gray-400"}`}>
                {label}
              </Text>
            </TouchableOpacity>
          ))
        }
      </View>
    </SafeAreaView>
  )
}