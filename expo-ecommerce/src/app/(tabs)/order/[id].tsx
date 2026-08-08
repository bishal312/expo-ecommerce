import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { server, useApp } from '../../../../context/AppContext';
import { OrderDetail } from '../../../../types';
import axios from 'axios';

export default function OrderScreen() {
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

    const router = useRouter();

    const { id } = useLocalSearchParams<{ id: string }>();
    const steps = ["Pending", "Shipped", "Delivered"] as const;
    const { isAuth, token, user } = useApp();

    const [order, setOrder] = useState<OrderDetail | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`${server}/api/order/${id}`,
                    {
                        headers: { token },
                    }
                );
                setOrder(data);
            } finally {
                setLoading(false)
            }
        })();
    }, [id]);

    const formatDate = (iso?: string) =>
        iso ? new Date(iso).toLocaleDateString("en-NP", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
            : "-";

    if (loading) {
        return <ActivityIndicator className='flex-1' color={"#0ea5e9"} size={"large"} />
    }

    if (!order) {
        return (
            <SafeAreaView className='flex-1 bg-gray-50 items-center justify-center px-8'>
                <Text className='text-5xl mb-4'>📦</Text>
                <Text className='text-gray-900 text-xl font-bold mb-2'>
                    Order not found
                </Text>
                <TouchableOpacity onPress={() => router.replace("/(tabs)/home")} className='bg-sky-500 px-8 py-3 rounded-2xl mt-4'>
                    <Text className='text-white font-bold'>Go Home</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
    const s = STATUS[order.status] ?? STATUS.Pending;
    const currentIdx = steps.indexOf(order.status);

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <View className='flex-row items-center px-5 py-4'>
                <TouchableOpacity className='mr-3 bg-white border border-gray-200 w-9 h-9 rounded-xl items-center justify-center shadow-sm' onPress={() => router.push("/orders")}>
                    <Text className='text-gray-600 font-bold'>⬅️</Text>
                </TouchableOpacity>

                <View className='flex-1'>
                    <Text className='text-xl font-bold text-gray-900 flex-1'>
                        Order Details
                    </Text>
                    <Text className='text-gray-400 text-xs'>
                        #{order._id.slice(-10).toUpperCase()}
                    </Text>
                </View>
                <View className={`flex-row items-center px-3 py-1.5 rounded-full border ${s.bg} ${s.border}`}>
                    <Text className={`text-xs font-bold ${s.color}`}>
                        {s.emoji} {order.status}
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
                <View className='bg-white rounded-3xl p-4 shadow-sm border border-gray-100'>
                    <Text className='text-gray-900 font-bold mb-4'>
                        Order Progress
                    </Text>
                    <View className='flex-row items-center'>
                        {steps.map((s, i) => {
                            const st = STATUS[s];
                            const reached = currentIdx >= i;
                            return (
                                <View key={i} className='flex-row items-center flex-1'>
                                    <View className='items-center flex-1'>
                                        <View className={
                                            `w-10 h-10 rounded-full items-center justify-center ${reached ? st.bg : "bg-gray-100"}`
                                        }>
                                            <Text className='text-lg'>{st.emoji}</Text>
                                        </View>

                                        <Text className={`text-xs font-semibold mt-1 ${reached ? st.color : "text-gray-400"}`}>{s}</Text>
                                    </View>
                                    {
                                        i < 2 && (
                                            <View className={`flex-1 h-0.5 mb-4 ${currentIdx > i ? "bg-sky-400" : "bg-gray-200"}`}>

                                            </View>
                                        )
                                    }
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View className='bg-white rounded-3xl p-4 shadow-sm border border-gray-100'>
                    <Text className='text-gray-900 font-bold mb-3'>
                        Order summary
                    </Text>
                    {
                        [
                            [
                                "Payment", order.method.toUpperCase()
                            ],
                            [
                                "Items", `${order.items.length} item${order.items.length > 1 ? "s" : ""}`
                            ],
                            [
                                "Placed On", formatDate(order.createdAt)
                            ],
                            [
                                "Paid At", order.paidAt ? formatDate(order.paidAt) : "Cash On Delivery",
                            ],
                        ].map(([label, value]) => (
                            <View key={label as string} className='flex-row justify-between py-2 border-b border-gray-100'>
                                <Text className='text-gray-400 text-sm'>
                                    {label as string}
                                </Text>
                                <Text className='text-gray-800 text-sm font-semibold'> {value as string}</Text>
                            </View>
                        ))
                    }

                    <View className='flex-row justify-between pt-3'>
                        <Text className='text-gray-500 font-medium'>
                            Total
                        </Text>
                        <Text className='text-orange-500 font-bold text-xl'>
                            ${order.subTotal}
                        </Text>
                    </View>
                </View>
                <View className='bg-white rounded-3xl p-4 shadow-sm border border-gray-100'>
                    <Text className='text-gray-900 font-bold mb-3'>
                        Shipping Detail
                    </Text>
                    <Text className='text-gray-400 text-xs mb-1'>
                        Address
                    </Text>
                    <Text className='text-gray-800 text-sm mb-3'>
                        {order.address}
                    </Text>
                    <Text className='text-gray-400 text-xs mb-1'>
                        Phone
                    </Text>
                    <Text className='text-gray-800 text-sm mb-3'>
                        {order.phone}
                    </Text>
                    <Text className='text-gray-400 text-xs mb-1'>
                        Email
                    </Text>
                    <Text className='text-gray-800 text-sm mb-3'>
                        {order.user.email}
                    </Text>
                </View>
                <View className='bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100'>
                    <Text className='text-gray-900 font-bold px-4 pb-2 pt-4'>
                        Product ({order.items.length})
                    </Text>
                    {
                        order.items.map((item, idx) => (
                            <View className='flex-row items-center px-4 py-3 border-t border-gray-100' key={idx}>
                                <View className='w-14 h-14 rounded-2xl bg-gray-50 overflow-hidden mr-3'>
                                    <Image source={{ uri: item.product?.images?.[0]?.url }} className='w-full h-full' resizeMode='contain' />
                                </View>
                                <View className='flex-1'>
                                    <Text className='text-gray-900 font-semibold text-sm' numberOfLines={1}>
                                        {item.product?.title}
                                    </Text>
                                    <Text className='text-gray-400 text-xs mt-0.5'>
                                        $ {item.product?.price} X {item.quantity}
                                    </Text>
                                </View>
                                <Text className='text-orange-500 font-bold text-xs'>
                                    ${(item.product?.price ?? 0) * (item.quantity ?? 0)}
                                </Text>
                            </View>
                        ))
                    }
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}