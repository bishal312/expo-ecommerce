import { createContext, useContext, useEffect, useState } from "react";
import { AppContextType, Product, User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios, { AxiosError } from "axios";
import Toast from "react-native-toast-message"

const server = "http://localhost:5000";

const defaultContext: AppContextType = {
    user: null,
    isAuth: false,
    authLoading: true,
    btnLoading: false,
    token: null,
    loginUser: async () => { },
    registerUser: async () => { },
    logoutUser: async () => { },
    products: [],
    productLoading: false,
    search: "",
    setSearch: () => { },
    category: "",
    categories: [],
    setCategory: () => { },
    sortByPrice: "",
    setSortByPrice: () => { },
    fetchProducts: async () => { },

};

const AppContext = createContext<AppContextType>
    (defaultContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setisAuth] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [price, setPrice] = useState();
    const [products, setProducts] = useState<Product[]>([]);
    const [productLoading, setProductsLoading] = useState(false);
    const [category, setCategory] = useState("");
    const [sortByPrice, setSortByPrice] = useState("");
    const [categories, setcategories] = useState<string[]>([]);

    const registerUser = async (
        name: string,
        email: string,
        password: string,
        setName: any,
        setEmail: any,
        setPassword: any,
        router: any,
    ) => {
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/user/register`, {
                name,
                email,
                password,
            });

            await AsyncStorage.setItem("token", data.token);
            setToken(data.token);
            setisAuth(true);
            setUser(data.user);
            Toast.show({ type: "success", text1: data.message });
            setEmail("");
            setPassword("");
            setName("");
            router.replace("/(tabs)/home");

        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            Toast.show({
                type: "error",
                text1: err.response?.data?.message ?? "Failed to register",
            });

            console.log(err);
        } finally {
            setBtnLoading(false);
        }
    };

    const loginUser = async (
        email: string,
        password: string,
        setEmail: any,
        setPassword: any,
        router: any,
    ) => {
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/user/login`, {
                email,
                password,
            });

            await AsyncStorage.setItem("token", data.token);
            setToken(data.token);
            setisAuth(true);
            setUser(data.user);
            Toast.show({ type: "success", text1: data.message });
            setEmail("");
            setPassword("");
            router.replace("/(tabs)/home");

        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            Toast.show({
                type: "error",
                text1: err.response?.data?.message ?? "Failed to login",
            });

            console.log(err);
        } finally {
            setBtnLoading(false);
        }
    };

    // Fetch Products
    async function fetchProducts() {
        setProductsLoading(true);
        try {
            const { data } = await axios.get(`${server}/api/product/all`, { params: { search, category, sortByPrice }, });

            setProducts(data.products);
            setcategories(data.categories || []);

        } catch (error) {
            Toast.show({ type: "error", text1: "Failed to load Products" });
        } finally {
            setProductsLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [search, category, sortByPrice]);

    async function logoutUser() {
        await AsyncStorage.removeItem("token");
        setUser(null);
        setisAuth(false);
        setToken(null);
        Toast.show({ type: "success", text1: "Logged out successfully!" })
    }
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
    };



    useEffect(() => {
        loadUser();
    }, []);

    return (
        < AppContext.Provider
            value={{ user, isAuth, btnLoading, authLoading, token, loginUser, registerUser, logoutUser, products, productLoading, categories, category, setCategory, search, setSearch, setSortByPrice, sortByPrice, fetchProducts }
            }
        >
            {children}
            <Toast />
        </AppContext.Provider >
    );
};

export const useApp = () => useContext(AppContext);
