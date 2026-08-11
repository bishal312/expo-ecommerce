import { Platform, View, Text, Dimensions, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { server, useApp } from '../context/AppContext';
import { BarChart } from "react-native-chart-kit";
import axios from 'axios';

const W = Dimensions.get("window").width;

interface ProductStat {
  name: string;
  sold: number;
}

interface StatsData {
  cod: number;
  data: ProductStat[];
}


export default function AdminStats() {
  const { token } = useApp();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (
      async () => {
        try {
          const { data } = await axios.get(`${server}/api/stats`, {
            headers: { token },
          });

          setStats({
            cod: Number(data?.cod ?? 0),
            data: Array.isArray(data?.data) ? data.data : [],
          });
        } finally {
          setLoading(false);
        }
      }
    )();
  }, [])

  if (loading) {
    return <ActivityIndicator className='flex-1' color={"#0ea5e9"} size={"large"} />
  }

  const products = (stats?.data ?? []).filter((p) => typeof p.name === "string");

  const top = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);
  const totalSold = products.reduce((s, p) => s + p.sold, 0);
  const summaryCard = [
    { emoji: "💰", label: "COD orders", value: stats?.cod },
    { emoji: "📦", label: "Products", value: products.length },
    { emoji: "📊", label: "Unit sold", value: totalSold },
  ]
  return (
    <ScrollView>
      <View className='flex-row gap-3 mb-4'>
        {summaryCard.map(({ emoji, label, value }) => (
          <View key={label} className='flex-1 bg-white rounded-3xl p-4 shadow-sm border items-center border-gray-100'>
            <Text className='text-2xl mb-1'>{emoji}</Text>
            <Text className='text-gray-900 text-xl font-bold'>
              {value}
            </Text>
            <Text className='text-gray-400 text-xs mt-0.5 text-center'>
              {label}
            </Text>
          </View>
        ))}
      </View>

      <View className='bg-white rounded-3xl p-4 shadow-sm border border-gray-100'>
        <Text className='text-gray-900 font-bold text-base mb-1'>
          Product sold
        </Text>
        <Text className='text-gray-400 text-xs mb-4'>
          Top {top.length} products by unit sold
        </Text>

        {top.length === 0 ? <View className='items-center py-10'>
          <Text className='text-4xl mb-2'>📊</Text>
          <Text className='text-gray-400'>No sales data yet</Text>
        </View> :
          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}>
            {Platform.OS === "web" ? (
              <View className="h-[220px] items-center justify-center">
                <Text className="text-gray-400">
                  Statistics chart is available in the mobile app.
                </Text>
              </View>
            ) : (
              <BarChart
                data={{
                  labels: top.map((p) =>
                    p.name.length > 8
                      ? `${p.name.slice(0, 8)}...`
                      : p.name
                  ),
                  datasets: [
                    {
                      data: top.map((p) => p.sold),
                    },
                  ],
                }}
                width={Math.max(W - 80, top.length * 80)}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                fromZero
                showValuesOnTopOfBars
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) =>
                    `rgba(14, 165, 233, ${opacity})`,
                  labelColor: () => "#9ca3af",
                  barPercentage: 0.65,
                }}
                style={{ borderRadius: 12 }}
              />
            )}
          </ScrollView>}
        {
          top.map((p) => (
            <View key={p.name} className='flex-row items-center justify-between mt-2'>
              <View className='flex-row itmes-center gap-2 flex-1'>
                <View className='w-2 mt-1 h-2 rounded-full bg-sky-500' />
                <Text className='text-gray-500 text-xs flex-1' numberOfLines={1}>
                  {p.name}
                </Text>
                <Text className='text-gray-900 text-xs font-bold ml-4'>
                  {p.sold} sold
                </Text>
              </View>
            </View>
          ))
        }
      </View>
    </ScrollView>
  )
}