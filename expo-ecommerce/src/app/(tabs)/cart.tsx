import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useApp } from '../../../context/AppContext'
import ProtectedRoutes from '../../../components/ProtectedRoutes';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

export default function CartScreen() {
    const { isAuth, cart, cartLoading, updateCart, removeFromCart } = useApp();
    const router = useRouter();

    const total = cart.reduce(
        (sum, item) => sum + item.product.price * item.quauntity, 0
    );

    if (cartLoading) {
        return <ActivityIndicator className='flex-1' color={"#0ea5e9"} />
    }
    return (
        <ProtectedRoutes isLoggedIn={isAuth}>
            <SafeAreaView className='flex-1 bg-gray-50'>
                <FlatList
                    data={cart}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{
                        paddingHorizontal: 15,
                        paddingBottom: 120
                    }}
                    ListHeaderComponent={
                        <Text className='text-2xl font-bold text-gray-900 mt-4 mb-4'>
                            My Cart 🛒
                        </Text>
                    }
                    ListEmptyComponent={
                        <View className='flex-1 items-center justify-center mt-20'>
                            <Text className='text-5xl mb-4'>🛒</Text>
                            <Text className='text-gray-400 text-base'>
                                Your Cart is empty
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (<>

                        <View className='bg-white rounded-3xl p-4
                        mb-3 flex-row shadow-sm border border-gray-100'>
                            <View className='w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden'>
                                <Image source={{ uri: item.product.images?.[0]?.url }}
                                    className='w-full h-full'
                                    resizeMode='contain'
                                />
                            </View>
                            <View className='flex-1 ml-3 justify-between'>
                                <Text className='text-sm font-semibold text-gray-900'
                                    numberOfLines={1}>
                                    {item.product.title}
                                </Text>
                            </View>
                            <Text className='text-orange-500 font-bold'>
                                ${item.product.price}
                            </Text>
                            <View className='flex-row items-center gap-3 mt-1'>
                                <TouchableOpacity onPress={() => updateCart(
                                    "dec", item._id
                                )} className='bg-gray-100 w-7 h-7 rounded-full items-center justify-center'>
                                    <Text className='text-gray-700 font-bold'>
                                        -
                                    </Text>
                                </TouchableOpacity>
                                <Text className='text-gray-700 font-semibold'>
                                    {item.quauntity}
                                </Text>
                                <TouchableOpacity onPress={() => updateCart(
                                    "inc", item._id
                                )} className='bg-gray-100 w-7 h-7 rounded-full items-center justify-center'>
                                    <Text className='text-gray-700 font-bold'>
                                        +
                                    </Text>
                                </TouchableOpacity>

                            </View>
                            <TouchableOpacity onPress={() => removeFromCart(item._id)} className='p-1 ml-5'>
                                <Text className='text-orange-700 text-lg'>
                                    X
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    )}
                />
                {cart.length > 0 && <View className='absolute bottom-0 left-0 right-0 px-6 bg-white border-t border-gray-100 py-4 shadow-lg'>
                    <View className='flex-row justify-between items-center mb-3'>
                        <Text className='text-gray-500'>{cart.length} items</Text>
                        <Text className='text-gray-900 text-lg font-bold'>${total}</Text>
                    </View>
                    <TouchableOpacity className='bg-sky-500 p-4 rounded-2xl' onPress={()=> router.push("/checkout")}>
                        <Text className='text-white text-center font-bold text-base'>
                            Proceed To Checkout
                        </Text>
                    </TouchableOpacity>
                </View>}
            </SafeAreaView>
        </ProtectedRoutes>
    )
}