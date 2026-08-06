import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../../context/AppContext";

export default function TabsLayout() {
    const { quantity } = useApp();
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#000",
                tabBarInactiveTintColor: "gray",
                tabBarBadge: route.name === "cart" && quantity > 0 ? quantity : undefined,
                // tabBarShowLabel: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = "home";

                    switch (route.name) {
                        case "home":
                            iconName = "home";
                            break;
                        case "cart":
                            iconName = "cart";
                            break;
                        case "account":
                            iconName = "person";
                            break;
                        case "orders":
                            iconName = "bag-outline";
                            break;
                        case "admin":
                            iconName = "person-outline";
                            break;
                    }

                    return (
                        <Ionicons
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tabs.Screen
                name="home"
                options={{ title: "Home" }}
            />
            <Tabs.Screen
                name="cart"
                options={{ title: "Cart", tabBarBadge: quantity > 0 ? quantity : undefined }}
            />
            <Tabs.Screen
                name="account"
                options={{ title: "Account" }}
            />
            <Tabs.Screen
                name="orders"
                options={{ title: "Orders", href: null }}
            />
            <Tabs.Screen
                name="admin"
                options={{ title: "Admin", href: null }}
            />
        </Tabs>
    );
}