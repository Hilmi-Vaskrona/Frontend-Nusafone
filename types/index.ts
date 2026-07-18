// ===========================
// API RESPONSE TYPES
// ===========================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  statusCode?: number;
}

// ===========================
// AUTH TYPES
// ===========================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: "user" | "admin";
}

export interface LoginResponse {
  access_token: string;
}

// ===========================
// USER TYPES
// ===========================

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

// ===========================
// CATEGORY TYPES
// ===========================

export interface Category {
  id: number;
  name: string;
  image: string | null;
  createdAt: string;
  products?: Product[];
}

// ===========================
// PRODUCT TYPES
// ===========================

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
  createdAt: string;
  category?: Category | null;
}

// ===========================
// CART TYPES
// ===========================

export interface CartItem {
  id: number;
  userId: string;
  productId: string;
  quantity: number;
  product?: Product | null;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

// ===========================
// ORDER TYPES
// ===========================

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  address: string;
  note: string;
  totalPrice: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

export interface CreateOrderRequest {
  address: string;
  note?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// ===========================
// RECEIPT TYPES
// ===========================

export interface Receipt {
  receipt: {
    orderId: number;
    storeName: string;
    date: string;
    customer: {
      name: string;
      email: string;
      address: string;
    };
    items: {
      name: string;
      image: string;
      quantity: number;
      price: number;
      subtotal: number;
    }[];
    note: string;
    totalPrice: number;
    status: OrderStatus;
  };
}
