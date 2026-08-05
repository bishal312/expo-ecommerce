import { Stack } from "expo-router";
import "../../global.css"
import React from "react";
import { AppProvider } from "../../context/AppContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
      </AppProvider>
    </>
  )
}
