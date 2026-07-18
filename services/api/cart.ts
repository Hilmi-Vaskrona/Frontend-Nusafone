import type { CartItem, ApiResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function getCart(token: string): Promise<ApiResponse<CartItem[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch {
    return { success: false, message: "Gagal memuat keranjang", data: [] };
  }
}

export async function addToCart(
  data: { productId: number; quantity: number },
  token: string
): Promise<ApiResponse<CartItem>> {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch {
    return { success: false, message: "Gagal menambahkan ke keranjang", data: {} as CartItem };
  }
}

export async function updateCartItem(
  id: number,
  data: { quantity: number },
  token: string
): Promise<ApiResponse<CartItem>> {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch {
    return { success: false, message: "Gagal mengupdate keranjang", data: {} as CartItem };
  }
}

export async function removeFromCart(id: number, token: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch {
    return { success: false, message: "Gagal menghapus dari keranjang", data: null };
  }
}
