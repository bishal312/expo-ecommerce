import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { useApp } from '../../../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tab = "products" | "orders" | "stats";
const TABS: { key: Tab; label: string, emoji: string }[] = [
  { key: "products", label: "Product", emoji: "📦" },
  { key: "orders", label: "Orders", emoji: "🛍️" },
  { key: "stats", label: "Stats", emoji: "📊" },
]

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>(
    "products"
  );

  if (!user || user.role !== "admin") return;
  return (
    <SafeAreaView>
      <View className='flex-row items-center px-5 py-4'>
        <TouchableOpacity className='mr-3 bg-white border border-gray-200 w-9 h-9 rounded-xl items-center justify-center shadow-sm' onPress={() => router.push("/account")}>
          <Text className='text-gray-600 font-bold'>
            ⬅️
          </Text>
        </TouchableOpacity>
        <Text className='text-xl font-bold text-gray-900 flex-1'>
          Admin Dashboard
        </Text>
      </View>

      <View className='flex-1'>
        {activeTab === "products" && (
          <View>
            {" "}
            <Text>Products</Text>
          </View>
        )}
        {
          activeTab === "orders"
        }
      </View>
    </SafeAreaView>
  )
}