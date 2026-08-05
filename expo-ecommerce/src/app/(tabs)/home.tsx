import { View, Text } from 'react-native'
import { useApp } from '../../../context/AppContext'

export default function HomeScreen() {
    const { logoutUser } = useApp()
    return (
        <View>
            <Text>HomeScreen</Text>
        </View>
    )
}