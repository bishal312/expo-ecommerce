export interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}

export interface ProductImage {
    id: string;
    url: string;
}

export interface Product {
    _id: string;
    title: string;
    about: string;
    price: number;
    stock: number;
    images: ProductImage[];
    sold: number;
    category: string;
    createdAt: string;
}

export interface AppContextType {
    user: User | null;
    isAuth: boolean;
    authLoading: boolean;
    btnLoading: boolean;
    token: string | null;
    registerUser: (
        name: string,
        email: string,
        password: string,
        setName: any,
        setEmail: any,
        setPassword: any,
        router: any,
    ) => Promise<void>,
    loginUser: (
        email: string,
        password: string,
        setEmail: any,
        setPassword: any,
        router: any,
    ) => Promise<void>,
    logoutUser: () => Promise<void>

    //products
    products: Product[];
    productLoading: boolean;
    search: string;
    setSearch: (val: string) => void;
    category: string;
    categories: string[];
    setCategory: (val: string) => void;
    sortByPrice: string;
    setSortByPrice: (val: string) => void;
    fetchProducts: () => Promise<void>;
}