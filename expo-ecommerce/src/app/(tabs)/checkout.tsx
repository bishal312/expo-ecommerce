import { View, Text, Alert, TouchableOpacity, ActivityIndicator, ScrollView, Modal, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { server, useApp } from '../../../context/AppContext';
import { Addresses } from '../../../types';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProtectedRoutes from '../../../components/ProtectedRoutes';

export default function CheckoutScreen() {
    const router = useRouter();
    const { token, isAuth } = useApp();
    const [addresses, setAddresses] = useState<Addresses[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ address: "", phone: "" });

    async function fetchAddresses() {
        setLoading(true);
        try {
            const { data } = await axios.get(`${server}/api/address/all`, {
                headers: {
                    token,
                }
            });
            setAddresses(Array.isArray(data) ? data : []);
        } catch (error: any) {

        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            fetchAddresses();
        }
    }, [token]);

    async function handleAdd() {
        if (!form.address.trim() || !form.phone.trim()) {
            return Toast.show({ type: "error", text1: "Please fill all fields" });
        }
        setSubmitting(true);
        try {
            await axios.post(`${server}/api/address/new`, form, {
                headers: {
                    token,
                }
            });
            Toast.show({ type: "success", text1: "Address added" });
            setForm({ address: "", phone: "" });
            setModalVisible(false);
            await fetchAddresses();
        } catch (error: any) {
            Toast.show({ type: "error", text1: error?.response?.data?.message ?? "Failed to add address" })
        } finally {
            setSubmitting(false);
        }
    }

    function handleDelete(id: string) {
        Alert.alert("Delete Address", "Are you sure?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await axios.delete(`${server}/api/address/${id}`,
                            {
                                headers: {
                                    token,
                                }
                            }
                        )
                        Toast.show({ type: "success", text1: "Address Deleted" })
                        await fetchAddresses();
                    }
                }
            ]
        );
    }
    return (
        <ProtectedRoutes isLoggedIn={isAuth}>
            <SafeAreaView className='flex-1 bg-gray-50'>
                <View className='flex-row items-center px-5 py-4'>
                    <TouchableOpacity className='mr-3 bg-white border border-gray-200 w-9 h-9 rounded-xl items-center justify-center shadow-sm' onPress={() => router.push("/cart")}>
                        <Text className='text-gray-600 text-xl font-bold'>
                            ⬅️
                        </Text>
                    </TouchableOpacity>
                    <Text className='text-xl font-bold text-gray-900 flex-1'>
                        Select Address
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)} className='bg-sky-500 px-4 py-2 rounded-xl'>
                        <Text className='text-white text-sm font-semibold'>
                            + Add
                        </Text>
                    </TouchableOpacity>
                </View>

                {
                    loading ? <ActivityIndicator className='flex-1'
                        color={"#0ea5e9"}
                        size={"large"} /> : <ScrollView
                            contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
                        >
                        {addresses.length === 0 ? (
                            <View className='items-center justify-center py-24'>
                                <Text className='text-5xl mb-3'>
                                    🗺️
                                </Text>
                                <Text className='text-gray-700 font-semibold text-base'>
                                    No addresses saved
                                </Text>
                                <Text className='text-green-600 text-sm mt-1'>
                                    Tap + Add to save a delivery address
                                </Text>
                            </View>
                        ) : (
                            addresses.map((item) => (
                                <View key={item._id} className='bg-white rounded-3xl p-4 shadow-sm border border-gray-100'>
                                    <View className='flex-row items-start mb-2'>
                                        <View className='flex-1'>
                                            <Text className='text-gray-900 font-semibold text-sm'>
                                                {item.address}
                                            </Text>
                                            <Text className='text-gray-400 text-xs mt-1'>
                                                📞 {item.phone}
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => handleDelete(item._id)}
                                            className='bg-red-50 p-2 rounded-xl'>
                                            <Text className='text-red-400 text-xs'>
                                                🗑️
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={() => router.push({ pathname: "/payment", params: { addressId: item._id } })}
                                        className='bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 p-3 w-full rounded-2xl'>
                                        <Text className='text-white text-center font-semibold text-sm'>
                                            Use this address ➡️
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </ScrollView>
                }
            </SafeAreaView>
            {/*Add Address Modal */}
            <Modal visible={modalVisible}
                animationType='slide' transparent>
                <View className='flex-1 bg-black/40 justify-end'>
                    <View className='bg-white rounded-t-3xl px-5 pb-8'>
                        <View className='flex-row items-center justify-between mt-5 mb-5'>
                            <Text className='text-lg font-bold text-gray-900'>
                                New Address
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} className='bg-gray-100 w-8 h-8 rounded-xl items-center justify-center'>
                                <Text className='text-gray-500'>
                                    X
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            value={form.address} onChangeText={(v) => setForm((p) => ({ ...p, address: v }))}
                            placeholder='Full Address...'
                            placeholderTextColor={"#9ca3af"}
                            multiline
                            numberOfLines={3}
                            className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 text-sm mb-3'
                            style={{ textAlignVertical: "top" }} />

                        <TextInput
                            value={form.phone} onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
                            placeholder='Phone Number...'
                            placeholderTextColor={"#9ca3af"}
                            className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 text-sm mb-3'
                            keyboardType='phone-pad' />

                        <TouchableOpacity onPress={handleAdd} disabled={submitting}
                            className='bg-sky-500 py-4 rounded-2xl'>
                            {submitting ? <ActivityIndicator color={"white"} size={"small"} /> : (
                                <Text className='text-white text-center font-bold'>Save Address</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ProtectedRoutes>
    )
}