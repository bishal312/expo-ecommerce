import { createContext, useContext, useEffect, useState } from "react";
import { AppContextType, User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";

const server = "http://localhost:5000";

const defaultContext: AppContextType = {
    user: null,
    isAuth: false,
    authLoading: true,
    btnLoading: false,
    token: null,
};

const AppContext = createContext<AppContextType>
    (defaultContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setisAuth] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    async function loadUser() {
        setAuthLoading(true);
        try {
            const storedToken = await AsyncStorage.getItem("token");
            if (!storedToken) return;

            const { data } = await axios.get(`${server}/api/user/me`, {
                headers: { token: storedToken },
            });
            setUser(data);
            setToken(storedToken);
            setisAuth(true);
        } catch (error) {
            setUser(null);
            setisAuth(false);
            console.log(error);
        } finally {
            setAuthLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, []);

    return (
        < AppContext.Provider
            value={{ user, isAuth, btnLoading, authLoading, token }
            }
        >
            {children}
        </AppContext.Provider >
    );
};

export const useApp = () => useContext(AppContext);
