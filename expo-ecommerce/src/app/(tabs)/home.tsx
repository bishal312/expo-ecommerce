import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../../components/ProductCard';

export default function HomeScreen() {
    const {
        products,
        isAuth,
        search,
        setSearch,
        category,
        setCategory,
        categories,
        setSortByPrice,
        sortByPrice,
    } = useApp();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 20,
                }}
                renderItem={({ item }) =>
                    //     (
                    //   <View className="bg-white p-4 mb-3 rounded-xl border border-gray-100">
                    //     <Text className="text-base font-semibold">{item.title}</Text>
                    //     <Text className="text-gray-500">${item.price}</Text>
                    //   </View>
                    // )
                    <ProductCard item={item} isAuth={isAuth} />
                }
                ListHeaderComponent={
                    <View>
                        {/* Header Title */}
                        <Text className="text-2xl font-bold text-gray-900 mt-4 mb-4">
                            Discover 📔
                        </Text>

                        {/* Search Input */}
                        <View className="bg-white flex-row items-center border border-gray-200 rounded-2xl px-4 mb-4 shadow-sm">
                            <Text className="text-gray-400 mr-2">🔍</Text>
                            <TextInput
                                placeholder="search Products..."
                                value={search}
                                onChangeText={setSearch}
                                className="flex-1 py-3 text-gray-800"
                                placeholderTextColor={"#9ca3af"}
                            />
                        </View>

                        {/* Categories List */}
                        <FlatList
                            data={["All", ...categories]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => {
                                const isActive = category === (item === "All" ? "" : item);
                                return (
                                    <TouchableOpacity
                                        onPress={() => setCategory(item === "All" ? "" : item)}
                                        className={`px-4 py-2 mr-2 rounded-full border ${isActive ? "bg-sky-500 border-sky-500" : "bg-white border-gray-200"
                                            }`}
                                    >
                                        <Text className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-600"}`}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                            className="mb-4"
                        />

                        {/* Sort Section (MOVED OUTSIDE CATEGORIES FLATLIST) */}
                        <View className="flex-row mb-4 gap-2">
                            {[
                                ["lowToHigh", "⬆️ Low to High"],
                                ["highToLow", "⬇️ High to Low"],
                            ].map(([val, label]) => {
                                const isActive = sortByPrice === val;
                                return (
                                    <TouchableOpacity
                                        key={val}
                                        onPress={() => setSortByPrice(isActive ? "" : (val as any))}
                                        className={`flex-1 py-2.5 rounded-xl shadow-sm border ${isActive ? "bg-sky-500 border-sky-500" : "bg-white border-gray-200"
                                            }`}
                                    >
                                        <Text className={`text-center font-medium ${isActive ? "text-white" : "text-gray-700"}`}>
                                            {label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    );
}