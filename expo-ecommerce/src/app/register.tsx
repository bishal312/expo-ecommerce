import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useApp } from '../../context/AppContext';
import PublicRoutes from '../../components/PublicRoutes';
import { Link, useRouter } from 'expo-router';

export default function RegisterScreen() {
    const { isAuth, btnLoading, registerUser } = useApp();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const isDisabled = btnLoading || !name || !email || !password;

    const handleRegister = () => {
        registerUser(name, email, password, setName, setEmail, setPassword, router);
        console.log(name, email, password);
    }
    return (
        <PublicRoutes isLoggedIn={isAuth}>
            <View className='flex-1 bg-white justify-center px-6'>
                <Text className='text-3xl font-bold text-center text-sky-500 mb-10'>Create Account! 😀</Text>

                <TextInput
                    placeholder='Name'
                    value={name}
                    onChangeText={setName}
                    className='border border-gray-300 rounded-xl px-4 py-3 mb-4'
                />

                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    className='border border-gray-300 rounded-xl px-4 py-3 mb-4'
                    keyboardType='email-address'
                    autoCapitalize='none'
                />
                <TextInput
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    className='border border-gray-300 rounded-xl px-4 py-3 mb-4'
                    secureTextEntry
                />
                <TouchableOpacity onPress={handleRegister} disabled={isDisabled} className={`py-3 rounded-xl ${isDisabled ? "bg-orange-300" : "bg-orange-500"}`}>
                    <Text className='text-black text-center font-semibold text-lg'>
                        {btnLoading ? "Please wait..." : "Register"}
                    </Text>
                </TouchableOpacity>

                <View className='flex-row justify-center mt-6'>
                    <Text className='text-gray-600'>Have an account? </Text>
                    <Link href={"/login"} className='text-sky-500 font-semibold'>Login</Link>
                </View>
            </View>
        </PublicRoutes>
    )
}