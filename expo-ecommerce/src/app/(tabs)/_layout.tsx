import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#000",
                tabBarInactiveTintColor: "gray",
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
                options={{ title: "Cart" }}
            />
            <Tabs.Screen
                name="account"
                options={{ title: "Account" }}
            />
        </Tabs>
    );
}