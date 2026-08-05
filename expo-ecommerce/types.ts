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
}