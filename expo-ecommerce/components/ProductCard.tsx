import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'

export default function ProductCard({ item, isAuth }: any) {
    return (
        <View className='flex-1 bg-white rounded-3xl overflow-hidden mb-3 shadow-sm border border-gray-100'>
            <View className='w-full h-36 bg-white'>
                <Image source={{
                    uri: item.images?.[0]?.url || ""
                }} className='w-full h-full'
                    resizeMode='contain' />
            </View>
            <View className='p-3'>
                <Text className='text-xs text-gray-400 mb-0.5'>
                    {item.category}
                </Text>
                <Text className='text-sm text-gray-900 font-semibold'>
                    {item.title}
                </Text>
                <Text className='font-bold text-orange-500 mt-1'>
                    ${item.price}
                </Text>
                <TouchableOpacity disabled={!isAuth} className={`mt-3 py-3 rounded-xl ${isAuth ? "bg-sky-500" : "bg-sky-100"}`}>
                    <Text className={`text-center text-xs font-semibold ${isAuth ? "text-white" : "text-gray-400"}`}>{isAuth ? "Add To Cart" : "Login Required"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}