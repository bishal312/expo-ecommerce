import { View, Platform, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Image, Modal, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { server, useApp } from '../context/AppContext';
import { Product } from '../types';
import * as ImagePicker from "expo-image-picker"
import Toast from 'react-native-toast-message';
import axios from 'axios';

const CATEGORIES = [
    "Clothing",
    "Footwear",
    "Accessories",
    "Electronics",
    "Beauty",
    "Home",
    "Sports",
    "Books",
    "Other",
];

const EMPTY_FORM = { title: "", about: "", category: "", price: "", stock: "" };

export default function AdminProducts() {
    const { products, fetchProducts, productLoading, token } = useApp();

    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [pickedImages, setPickedImagees] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const filtered = products.filter(
        (p) => p.title.toLowerCase().includes(search.toLowerCase())
    );

    function openAdd() {
        setEditProduct(null);
        setForm(EMPTY_FORM);
        setPickedImagees([]);
        setModalVisible(true);
    }

    function openEdit(p: Product) {
        setEditProduct(p);
        setForm({
            title: p.title,
            about: p.about,
            category: p.category,
            price: String(p.price),
            stock: String(p.stock),
        });
        setPickedImagees([]);
        setModalVisible(true);
    }

    async function appendImage(
        fd: FormData,
        uri: string,
        index: number
    ) {
        const name = uri.split("/").pop() ?? `img_${index}.jpg`;

        if (Platform.OS === "web") {
            const response = await fetch(uri);
            const blob = await response.blob();

            fd.append(
                "files",
                new File(
                    [blob],
                    name,
                    {
                        type: blob.type || "image/jpeg",
                    }
                )
            );
        } else {
            fd.append(
                "files",
                {
                    uri,
                    name,
                    type: `image/${name.split(".").pop() || "jpeg"}`,
                } as any
            );
        }
    }

    async function pickImages() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });
        if (!result.canceled) setPickedImagees(result.assets.map((a: any) => a.uri));
    }

    async function handleSubmit() {
        if (
            !form.title ||
            !form.about ||
            !form.category ||
            !form.price ||
            !form.stock
        ) {
            return Toast.show({
                type: "error",
                text1: "Please fill all fields",
            });
        }

        if (!editProduct && pickedImages.length === 0) {
            return Toast.show({
                type: "error",
                text1: "Please select at least one image",
            });
        }

        setSubmitting(true);

        try {
            if (editProduct) {
                await axios.put(
                    `${server}/api/product/${editProduct._id}`,
                    {
                        title: form.title,
                        about: form.about,
                        category: form.category,
                        price: form.price,
                        stock: form.stock,
                    },
                    {
                        headers: {
                            token,
                        },
                    }
                );

                if (pickedImages.length > 0) {
                    const fd = new FormData();

                    for (const [i, uri] of pickedImages.entries()) {
                        await appendImage(fd, uri, i);
                    }

                    await axios.post(
                        `${server}/api/product/${editProduct._id}`,
                        fd,
                        {
                            headers: {
                                token,
                            },
                        }
                    );
                }

                Toast.show({
                    type: "success",
                    text1: "Product Updated",
                });
            }

            else {
                const fd = new FormData();

                Object.entries(form).forEach(([key, value]) => {
                    fd.append(key, String(value));
                });

                for (const [i, uri] of pickedImages.entries()) {
                    await appendImage(fd, uri, i);
                }

                await axios.post(
                    `${server}/api/product/new`,
                    fd,
                    {
                        headers: {
                            token,
                        },
                    }
                );

                Toast.show({
                    type: "success",
                    text1: "Product Added",
                });
            }

            await fetchProducts();
            setModalVisible(false);

        } catch (error: any) {
            console.log(
                "Product operation error:",
                error.response?.data || error.message
            );

            Toast.show({
                type: "error",
                text1:
                    error.response?.data?.message ||
                    (editProduct
                        ? "Failed to update product"
                        : "Failed to add product"),
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <View className='flex-1 '>
            <View className='px-4 pt-3 pb-2 flex-row gap-3 items-center'>
                <View className={`flex-1 bg-white flex-row items-center border-gray-200 rounded-2xl px-4 shadow-sm`}>
                    <Text className='text-gray-400 mr-2'>🔍</Text>
                    <TextInput value={search} onChangeText={setSearch} placeholder='search products...'
                        placeholderTextColor={"#9ca3af"}
                        className='flex-1 py-3 text-gray-800 text-sm' />
                </View>
                <TouchableOpacity onPress={openAdd}
                    className='w-11 h-11 rounded-2xl bg-sky-500 items-center justify-center'>
                    <Text className='text-white text-xl font-bold'>
                        +
                    </Text>
                </TouchableOpacity>
            </View>

            {
                productLoading ? <ActivityIndicator className='flex-1' color={"#9ea5e9"} size={"large"} /> :
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingBottom: 16
                        }}
                        ListEmptyComponent={
                            <View className='items-center py-16'>
                                <Text className='text-4xl mb-2'>📦</Text>
                                <Text className='text-gray-400'>No product found</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <View className='flex-row bg-white rounded-3xl overflow-hidden mb-3 shadow-sm border border-gray-100'>
                                <View className='w-20 h-20 bg-gray-50 items-center justify-center'>
                                    {item.images?.[0]?.url ? <Image source={{
                                        uri: item.images?.[0]?.url
                                    }} style={{ width: 80, height: 80 }}
                                        resizeMode='contain' /> :
                                        <Text className='text-3xl'>📦</Text>}
                                </View>
                                <View className='flex-1 px-3 py-2 justify-between'>
                                    <Text className='text-gray-900 font-semibold text-sm' numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <Text className='text-gray-400 text-xs'>
                                        {item.category} • ${item.price}
                                    </Text>

                                    <View className='flex-row items-center justify-between'>
                                        <Text className={`text-xs font-medium 
                                            ${item.stock === 0
                                                ? "text-red-400"
                                                : "text-green-500"}`}
                                        >
                                            {item.stock === 0 ? "out of stock" : `${item.stock} in stock`}
                                        </Text>
                                        <View className='flex-row gap-2'>
                                            <TouchableOpacity onPress={() => openEdit(item)} className='bg-sky-50 border border-sky-200 px-3 py-1 rounded-xl'>
                                                <Text className='text-sky-500 text-xs font-semibold'>
                                                    Edit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                        }
                    />
            }

            <Modal visible={modalVisible} animationType='slide' transparent>
                <View className='flex-1 bg-black/40 justify-end'>
                    <View className='bg-white rounded-3xl'>

                        <View className='flex-row items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100'>
                            <Text className='text-lg font-bold text-gray-900'>
                                {
                                    editProduct ? "Edit Product" : "Add Product"
                                }
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} className='bg-gray-100 w-8 h-8 rounded-xl items-center justify-center'>
                                <Text className='text-gray-500'>
                                    X
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }} keyboardShouldPersistTaps="handled">
                            {
                                (["title", "about", "price", "stock"] as const).map((field) => (
                                    <View key={field}>
                                        <Text className='text-gray-500 text-xs font-semibold capitalize mb-1'>
                                            {
                                                field
                                            }
                                        </Text>
                                        <TextInput value={form[field]} onChangeText={(v) => setForm((f) => (
                                            {
                                                ...form, [field]: v
                                            }
                                        )
                                        )
                                        }
                                            placeholder={`Enter ${field}`}
                                            placeholderTextColor={"#9ca3af"}
                                            keyboardType={field === "price" || field === "stock" ? "numeric" : "default"}
                                            className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 text-sm' />
                                    </View>
                                ))
                            }
                            <View className=''>
                                <Text className='text-gray-500 text-xs font-semibold mb-2'>
                                    Category
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                                    {
                                        CATEGORIES.map((cat) => (
                                            <TouchableOpacity key={cat} onPress={() => setForm((f) => ({ ...f, category: cat }))} className={`px-4 py-2 rounded-full border ${form.category === cat ? "bg-sky-500 border-sky-500" : "bg-gray-50 border-gray-100"}`}>
                                                <Text className={`text-xs font-semibold ${form.category === cat ? "text-white" : "text-gray-600"}`}>
                                                    {cat}
                                                </Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView>
                            </View>
                            <View>
                                <Text className='text-gray-500 text-xs font-semibold mb-2'>
                                    Images
                                </Text>
                                <TouchableOpacity onPress={pickImages} className='bg-gray-50 border border-dashed border-gray-300 rounded-2xl h-14 items-center justify-center'>
                                    <Text className='text-gray-400 text-sm'>
                                        {
                                            pickedImages.length > 0 ? `${pickedImages.length} images selected` : editProduct ? "Pick new images (optional)" : "Tap to pic images"
                                        }
                                    </Text>
                                </TouchableOpacity>
                                {
                                    pickedImages.length > 0 && <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mt-2'>
                                        <View className='flex-row gap-2'>
                                            {pickedImages.map((uri: any, i) => (
                                                <Image key={i} source={uri}
                                                    style={{ width: 64, height: 64, borderRadius: 12 }}
                                                    resizeMode='cover' />
                                            ))}
                                        </View>
                                    </ScrollView>
                                }
                            </View>
                            <TouchableOpacity onPress={handleSubmit} disabled={submitting} className='bg-sky-500 py-4 rounded-2xl items-center mt-2 mb-4'>
                                {submitting ? <ActivityIndicator color={"#ffff"} size={"small"} /> :
                                    <Text className='text-white font-bold text-base'>
                                        {
                                            editProduct ? "Save Changes" : "Add Product"
                                        }
                                    </Text>}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View >
    )
}