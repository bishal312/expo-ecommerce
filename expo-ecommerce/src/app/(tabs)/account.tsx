import { View, Text } from 'react-native'
import React from 'react'
import { useApp } from '../../../context/AppContext'
import ProtectedRoutes from '../../../components/ProtectedRoutes';

export default function AccountScreen() {
    const { isAuth } = useApp();
    return (
        <ProtectedRoutes isLoggedIn={isAuth}>
            <View>
                <Text>AccountScreen</Text>
            </View>
        </ProtectedRoutes>
    )
}