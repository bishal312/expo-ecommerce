import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useApp } from "../../../context/AppContext";
import ProtectedRoutes from "../../../components/ProtectedRoutes";

export default function AccountScreen() {
    const { isAuth, user, logoutUser } = useApp();
    const router = useRouter();

    const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";
    const isAdmin = user?.role === "admin";

    return (
        <ProtectedRoutes isLoggedIn={isAuth}>
            <StatusBar barStyle="dark-content" />

            <SafeAreaView className="flex-1 bg-gray-100 px-5">
                {/* Heading */}
                <Text className="text-3xl font-bold text-gray-900 mt-4">
                    Account
                </Text>

                <Text className="text-gray-500 mt-1 mb-6">
                    Manage your account
                </Text>

                {/* Profile Card */}
                <View className="bg-white rounded-3xl p-5 shadow-sm">
                    <View className="flex-row items-center">
                        <View className="h-20 w-20 rounded-full bg-sky-500 items-center justify-center">
                            <Text className="text-white text-3xl font-bold">
                                {firstLetter}
                            </Text>
                        </View>

                        <View className="ml-4 flex-1">
                            <Text className="text-xl font-bold text-gray-900">
                                {user?.name}
                            </Text>

                            <Text className="text-gray-500 mt-1">
                                {user?.email}
                            </Text>

                            {isAdmin && (
                                <View className="self-start mt-3 bg-orange-100 px-3 py-1 rounded-full">
                                    <Text className="text-orange-600 font-semibold text-xs">
                                        ADMIN
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Menu */}
                <View className="bg-white rounded-3xl mt-6 overflow-hidden shadow-sm">

                    <TouchableOpacity
                        onPress={() => router.push("/orders")}
                        className="flex-row items-center justify-between px-5 py-5 border-b border-gray-100"
                    >
                        <View className="flex-row items-center">
                            <Ionicons
                                name="bag-outline"
                                size={22}
                                color="#333"
                            />
                            <Text className="ml-4 text-base font-medium">
                                My Orders
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>

                    {isAdmin && (
                        <TouchableOpacity
                            className="flex-row items-center justify-between px-5 py-5"
                            onPress={() => router.push("/admin")}
                        >
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="grid-outline"
                                    size={22}
                                    color="#333"
                                />

                                <Text className="ml-4 text-base font-medium">
                                    Admin Dashboard
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#999"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    onPress={async () => {
                        await logoutUser();
                        router.replace("/login");
                    }}
                    className="bg-red-500 rounded-2xl py-4 mt-8"
                >
                    <Text className="text-center text-white text-base font-semibold">
                        Logout
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ProtectedRoutes>
    );
}