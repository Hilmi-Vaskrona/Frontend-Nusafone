import type { Product, Category, ApiResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function apiFetch<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: String(error), data: {} as T };
  }
}

async function apiFetchAuth<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    token: string;
  }
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${options.token}`,
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: String(error), data: {} as T };
  }
}

// ===========================
// PUBLIC
// ===========================

export async function getAllProducts(): Promise<ApiResponse<Product[]>> {
  return apiFetch<Product[]>("/products");
}

export async function getProductById(id: number): Promise<ApiResponse<Product>> {
  return apiFetch<Product>(`/products/${id}`);
}

export async function getProductsByCategoryId(
  categoryId: number
): Promise<ApiResponse<Product[]>> {
  return apiFetch<Product[]>(`/products/category/${categoryId}`);
}

export async function getAllCategories(): Promise<ApiResponse<Category[]>> {
  return apiFetch<Category[]>("/categories");
}

export async function getCategoryById(
  id: number
): Promise<ApiResponse<Category>> {
  return apiFetch<Category>(`/categories/${id}`);
}

// ===========================
// ADMIN: CATEGORIES CRUD
// ===========================

export async function createCategory(
  data: { name: string; image?: string },
  token: string
): Promise<ApiResponse<Category>> {
  return apiFetchAuth<Category>("/categories", {
    method: "POST",
    body: data,
    token,
  });
}

export async function updateCategory(
  id: number,
  data: { name?: string; image?: string },
  token: string
): Promise<ApiResponse<Category>> {
  return apiFetchAuth<Category>(`/categories/${id}`, {
    method: "PATCH",
    body: data,
    token,
  });
}

export async function deleteCategory(
  id: number,
  token: string
): Promise<ApiResponse<null>> {
  return apiFetchAuth<null>(`/categories/${id}`, {
    method: "DELETE",
    token,
  });
}

// ===========================
// ADMIN: PRODUCTS CRUD
// ===========================

export async function createProduct(
  data: {
    name: string;
    description?: string;
    price: number;
    stock?: number;
    imageUrl?: string;
    categoryId: number;
  },
  token: string
): Promise<ApiResponse<Product>> {
  return apiFetchAuth<Product>("/products", {
    method: "POST",
    body: data,
    token,
  });
}

export async function updateProduct(
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    imageUrl?: string;
    categoryId?: number;
  },
  token: string
): Promise<ApiResponse<Product>> {
  return apiFetchAuth<Product>(`/products/${id}`, {
    method: "PATCH",
    body: data,
    token,
  });
}

export async function deleteProduct(
  id: number,
  token: string
): Promise<ApiResponse<null>> {
  return apiFetchAuth<null>(`/products/${id}`, {
    method: "DELETE",
    token,
  });
}
