import type {
  Order,
  OrderStatus,
  Receipt,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  ApiResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function createOrder(
  data: CreateOrderRequest,
  token: string
): Promise<ApiResponse<Order>> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch {
    return { success: false, message: "Gagal membuat order", data: {} as Order };
  }
}

export async function getUserOrders(
  token: string
): Promise<ApiResponse<Order[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch {
    return { success: false, message: "Gagal memuat daftar order", data: [] };
  }
}

export async function getOrderById(
  orderId: number,
  token: string
): Promise<ApiResponse<Order>> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch {
    return { success: false, message: "Gagal memuat detail order", data: {} as Order };
  }
}

export async function getOrderReceipt(
  orderId: number,
  token: string
): Promise<ApiResponse<Receipt>> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/receipt`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch {
    return { success: false, message: "Gagal memuat receipt", data: {} as Receipt };
  }
}

export async function cancelOrder(
  orderId: number,
  token: string
): Promise<ApiResponse<Order>> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch {
    return { success: false, message: "Gagal membatalkan order", data: {} as Order };
  }
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
  token: string
): Promise<ApiResponse<Order>> {
  try {
    const body: UpdateOrderStatusRequest = { status };
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch {
    return { success: false, message: "Gagal mengupdate status order", data: {} as Order };
  }
}
