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

export interface CartItem {
    _id: string;
    quauntity: number;
    product: Product;
    user: string;


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

    // Cart
    cart: CartItem[];
    cartLoading: boolean;
    addToCart: (productId: string) => Promise<void>;
    updateCart: (action: "inc" | "dec", cartItemId: string) => Promise<void>;
    removeFromCart: (cartItemId: string) => Promise<void>;
    fetchCart: () => Promise<void>;
    quantity: number;
}

export interface Addresses {
    _id: string,
    address: string,
    phone: string,
}

export interface Order {
    _id: string;
    status: "Pending" | "Shipped" | "Delivered";
    items: any[];
    subTotal: number;
    method: string;
    createdAt: string;
}

export interface OrderDetail {
    _id: string;
    status: "Pending" | "Shipped" | "Delivered";
    items: {
        product: {
            _id: string;
            title: string;
            price: number;
            images: { url: string }[];
        };
        quantity: number;
    }[];
    subTotal: number;
    method: string;
    createdAt: string;
    paidAt?: string;
    address: string;
    phone: string;
    user: { _id: string; email: string; };
}