# Nusafone Backend API - Documentation

> Dokumentasi lengkap untuk frontend team. Base URL: `https://backend-nusafone.vercel.app`

---

## 1. Overview

| Item         | Value                                      |
| ------------ | ------------------------------------------ |
| Base URL     | `https://backend-nusafone.vercel.app`      |
| Framework    | NestJS (TypeScript)                        |
| Database     | Firebase Firestore                         |
| Auth         | JWT (Bearer Token)                         |
| Content-Type | `application/json`                         |

---

## 2. Getting Started

### 2.1 Standard Response Format

Semua endpoint mengembalikan format yang sama:

**Success:**

```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Bad Request",
  "statusCode": 400
}
```

### 2.2 Authentication

**Cara Login:**

1. `POST /auth/login` dengan `email` + `password`
2. Response mengembalikan `access_token` (JWT string)
3. Simpan token, gunakan di semua request yang butuh auth

**Cara Pakai Token:**

Tambahkan header di setiap request yang butuh auth:

```
Authorization: Bearer <access_token>
```

**Role System:**

| Role    | Akses                                                          |
| ------- | -------------------------------------------------------------- |
| `user`  | Cart, Orders, Profile                                          |
| `admin` | Semua akses user + CRUD Categories, Products, Update Status Order |

---

## 3. TypeScript Types

Copy-paste interface ini ke frontend project:

```typescript
// ===== Auth =====
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'user' | 'admin';
}

interface LoginResponse {
  access_token: string;
}

// ===== User =====
interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// ===== Category =====
interface Category {
  id: number;
  name: string;
  image: string | null;
  createdAt: string;
}

interface CategoryWithProducts extends Category {
  products: Product[];
}

// ===== Product =====
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
  createdAt: string;
  category: Category | null;
}

// ===== Cart =====
interface CartItem {
  id: number;
  userId: string;
  productId: string;
  quantity: number;
  product: Product | null;
}

interface AddToCartRequest {
  productId: number;
  quantity: number;
}

interface UpdateCartRequest {
  quantity: number;
}

// ===== Order =====
interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
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

type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface CreateOrderRequest {
  address: string;
  note?: string;
}

interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// ===== Receipt =====
interface Receipt {
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

// ===== API Response Wrapper =====
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiError {
  success: false;
  message: string;
  error: string;
  statusCode: number;
}
```

---

## 4. API Reference

### 4.1 Auth Module

---

#### POST /auth/register

**Auth:** Public

**Request Body:**

| Field           | Type   | Required | Description                    |
| --------------- | ------ | -------- | ------------------------------ |
| name            | string | Yes      | Nama lengkap                   |
| email           | string | Yes      | Email (unique)                 |
| password        | string | Yes      | Min 6 karakter                 |
| confirmPassword | string | Yes      | Harus sama dengan `password`   |
| role            | string | No       | `"user"` (default) / `"admin"` |

**Response 201:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Hilmi",
    "email": "hilmi@example.com",
    "role": "user",
    "createdAt": "2026-07-16T03:24:12.521Z"
  }
}
```

**Error Responses:**

| Status | Message                                    |
| ------ | ------------------------------------------ |
| 400    | Password and confirm password do not match |
| 409    | Email already registered                   |

---

#### POST /auth/login

**Auth:** Public

**Request Body:**

| Field    | Type   | Required | Description |
| -------- | ------ | -------- | ----------- |
| email    | string | Yes      | Email       |
| password | string | Yes      | Password    |

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

| Status | Message          |
| ------ | ---------------- |
| 401    | Invalid credentials |

---

#### GET /auth/profile

**Auth:** User / Admin

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Hilmi",
    "email": "hilmi@example.com",
    "role": "user",
    "createdAt": "2026-07-16T03:24:12.521Z"
  }
}
```

> Field `password` tidak pernah dikembalikan di response.

---

### 4.2 Users Module

---

#### GET /users/profile

**Auth:** User / Admin

> Sama seperti `GET /auth/profile`. Bisa dipilih salah satu.

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Hilmi",
    "email": "hilmi@example.com",
    "role": "user",
    "createdAt": "2026-07-16T03:24:12.521Z"
  }
}
```

---

### 4.3 Categories Module

---

#### GET /categories

**Auth:** Public

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Smartphone & Tablet",
      "image": "https://example.com/smartphone.jpg",
      "createdAt": "2026-07-16T03:17:22.560Z"
    },
    {
      "id": 2,
      "name": "Laptop & PC",
      "image": null,
      "createdAt": "2026-07-16T03:17:30.000Z"
    }
  ]
}
```

---

#### GET /categories/:id

**Auth:** Public

**Params:**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | number | Category ID |

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Smartphone & Tablet",
    "image": "https://example.com/smartphone.jpg",
    "createdAt": "2026-07-16T03:17:22.560Z",
    "products": [
      {
        "id": 1,
        "name": "Samsung Galaxy S24",
        "description": "Smartphone flagship Samsung 2024",
        "price": 12999000,
        "stock": 50,
        "imageUrl": "https://example.com/s24.jpg",
        "categoryId": "1",
        "createdAt": "2026-07-16T03:24:12.521Z"
      }
    ]
  }
}
```

> Response include array `products` yang termasuk di category ini.

**Error Responses:**

| Status | Message            |
| ------ | ------------------ |
| 404    | Category not found |

---

#### POST /categories

**Auth:** Admin only

**Request Body:**

| Field | Type   | Required | Description         |
| ----- | ------ | -------- | ------------------- |
| name  | string | Yes      | Nama category       |
| image | string | No       | URL gambar category |

**Response 201:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 3,
    "name": "Audio & Sound",
    "image": "https://example.com/audio.jpg",
    "createdAt": "2026-07-16T04:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message                        |
| ------ | ------------------------------ |
| 403    | Only admin can create categories |

---

#### PATCH /categories/:id

**Auth:** Admin only

**Params:**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | number | Category ID |

**Request Body (semua field optional):**

| Field | Type   | Required | Description        |
| ----- | ------ | -------- | ------------------ |
| name  | string | No       | Nama category baru |
| image | string | No       | URL gambar baru    |

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 3,
    "name": "Audio & Sound System",
    "image": "https://example.com/audio-new.jpg",
    "createdAt": "2026-07-16T04:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message                        |
| ------ | ------------------------------ |
| 403    | Only admin can update categories |
| 404    | Category not found             |

---

#### DELETE /categories/:id

**Auth:** Admin only

**Params:**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | number | Category ID |

**Response 200:**

```json
{
  "success": true,
  "message": "Category deleted",
  "data": null
}
```

**Error Responses:**

| Status | Message                        |
| ------ | ------------------------------ |
| 403    | Only admin can delete categories |
| 404    | Category not found             |

---

### 4.4 Products Module

---

#### GET /products

**Auth:** Public

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Samsung Galaxy S24",
      "description": "Smartphone flagship Samsung 2024",
      "price": 12999000,
      "stock": 50,
      "imageUrl": "https://example.com/s24.jpg",
      "categoryId": "3",
      "createdAt": "2026-07-16T03:24:12.521Z",
      "category": {
        "id": 3,
        "name": "Smartphone & Tablet",
        "image": null,
        "createdAt": "2026-07-16T03:17:22.560Z"
      }
    },
    {
      "id": 2,
      "name": "Nintendo Switch 2",
      "description": "Brand New Nintendo",
      "price": 3999000,
      "stock": 10,
      "imageUrl": "https://example.com/switch2.jpg",
      "categoryId": "5",
      "createdAt": "2026-07-16T03:26:14.777Z",
      "category": {
        "id": 5,
        "name": "Gameboy & Nintendo",
        "image": null,
        "createdAt": "2026-07-16T03:17:59.337Z"
      }
    }
  ]
}
```

> Setiap product include object `category` (joined di backend).

---

#### GET /products/category/:id

**Auth:** Public

**Params:**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | number | Category ID |

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Samsung Galaxy S24",
      "description": "Smartphone flagship Samsung 2024",
      "price": 12999000,
      "stock": 50,
      "imageUrl": "https://example.com/s24.jpg",
      "categoryId": "3",
      "createdAt": "2026-07-16T03:24:12.521Z",
      "category": {
        "id": 3,
        "name": "Smartphone & Tablet",
        "image": null,
        "createdAt": "2026-07-16T03:17:22.560Z"
      }
    }
  ]
}
```

---

#### GET /products/:id

**Auth:** Public

**Params:**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | number | Product ID  |

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Samsung Galaxy S24",
    "description": "Smartphone flagship Samsung 2024",
    "price": 12999000,
    "stock": 50,
    "imageUrl": "https://example.com/s24.jpg",
    "categoryId": "3",
    "createdAt": "2026-07-16T03:24:12.521Z",
    "category": {
      "id": 3,
      "name": "Smartphone & Tablet",
      "image": null,
      "createdAt": "2026-07-16T03:17:22.560Z"
    }
  }
}
```

**Error Responses:**

| Status | Message           |
| ------ | ----------------- |
| 404    | Product not found |

---

#### POST /products

**Auth:** Admin only

**Request Body:**

| Field       | Type   | Required | Description                        |
| ----------- | ------ | -------- | ---------------------------------- |
| name        | string | Yes      | Nama product                       |
| description | string | No       | Deskripsi product                  |
| price       | number | Yes      | Harga dalam Rupiah                 |
| stock       | number | No       | Stok (default: 0)                  |
| imageUrl    | string | No       | URL gambar product                 |
| categoryId  | number | Yes      | ID category (angka, bukan string)  |

**Response 201:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 3,
    "name": "Sony WH-1000XM5",
    "description": "Headphone noise cancelling premium",
    "price": 4999000,
    "stock": 25,
    "imageUrl": "https://example.com/sony-xm5.jpg",
    "categoryId": "4",
    "createdAt": "2026-07-16T05:00:00.000Z"
  }
}
```

> `categoryId` dikirim sebagai number, tapi disimpan sebagai string di Firestore.

**Error Responses:**

| Status | Message                        |
| ------ | ------------------------------ |
| 403    | Only admin can create products |

---

#### PATCH /products/:id

**Auth:** Admin only

**Params:**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | number | Product ID  |

**Request Body (semua field optional):**

| Field       | Type   | Required | Description       |
| ----------- | ------ | -------- | ----------------- |
| name        | string | No       | Nama product baru |
| description | string | No       | Deskripsi baru    |
| price       | number | No       | Harga baru        |
| stock       | number | No       | Stok baru         |
| imageUrl    | string | No       | URL gambar baru   |
| categoryId  | number | No       | Category ID baru  |

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 3,
    "name": "Sony WH-1000XM5",
    "description": "Headphone noise cancelling premium - Updated",
    "price": 4500000,
    "stock": 20,
    "imageUrl": "https://example.com/sony-xm5-new.jpg",
    "categoryId": "4",
    "createdAt": "2026-07-16T05:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message                       |
| ------ | ----------------------------- |
| 403    | Only admin can update products |
| 404    | Product not found             |

---

#### DELETE /products/:id

**Auth:** Admin only

**Params:**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | number | Product ID  |

**Response 200:**

```json
{
  "success": true,
  "message": "Product deleted",
  "data": null
}
```

**Error Responses:**

| Status | Message                       |
| ------ | ----------------------------- |
| 403    | Only admin can delete products |
| 404    | Product not found             |

---

### 4.5 Cart Module

> Semua endpoint di Cart membutuhkan auth (token).

---

#### GET /cart

**Auth:** User / Admin

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "userId": "1",
      "productId": "1",
      "quantity": 2,
      "product": {
        "id": 1,
        "name": "Samsung Galaxy S24",
        "description": "Smartphone flagship Samsung 2024",
        "price": 12999000,
        "stock": 50,
        "imageUrl": "https://example.com/s24.jpg",
        "categoryId": "3",
        "createdAt": "2026-07-16T03:24:12.521Z"
      }
    },
    {
      "id": 2,
      "userId": "1",
      "productId": "2",
      "quantity": 1,
      "product": {
        "id": 2,
        "name": "Nintendo Switch 2",
        "description": "Brand New Nintendo",
        "price": 3999000,
        "stock": 10,
        "imageUrl": "https://example.com/switch2.jpg",
        "categoryId": "5",
        "createdAt": "2026-07-16T03:26:14.777Z"
      }
    }
  ]
}
```

> Setiap cart item include object `product` (joined di backend).

---

#### POST /cart

**Auth:** User / Admin

**Request Body:**

| Field     | Type   | Required | Description         |
| --------- | ------ | -------- | ------------------- |
| productId | number | Yes      | ID product (angka)  |
| quantity  | number | Yes      | Jumlah (min: 1)     |

**Response 201:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "userId": "1",
    "productId": "1",
    "quantity": 2
  }
}
```

> **Behavior:**
> - Jika product sudah ada di cart user, `quantity` akan **ditambah** (bukan duplicate)
> - Validasi stok: quantity tidak boleh melebihi stock product

**Error Responses:**

| Status | Message            |
| ------ | ------------------ |
| 404    | Product not found  |
| 400    | Insufficient stock |

---

#### PATCH /cart/:id

**Auth:** User / Admin

**Params:**

| Param | Type   | Description  |
| ----- | ------ | ------------ |
| id    | number | Cart Item ID |

**Request Body:**

| Field    | Type   | Required | Description          |
| -------- | ------ | -------- | -------------------- |
| quantity | number | Yes      | Jumlah baru (min: 1) |

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "userId": "1",
    "productId": "1",
    "quantity": 5
  }
}
```

**Error Responses:**

| Status | Message            |
| ------ | ------------------ |
| 404    | Cart item not found |
| 400    | Insufficient stock |

---

#### DELETE /cart/:id

**Auth:** User / Admin

**Params:**

| Param | Type   | Description  |
| ----- | ------ | ------------ |
| id    | number | Cart Item ID |

**Response 200:**

```json
{
  "success": true,
  "message": "Cart item deleted",
  "data": null
}
```

**Error Responses:**

| Status | Message            |
| ------ | ------------------ |
| 404    | Cart item not found |

---

### 4.6 Orders Module

> Semua endpoint di Orders membutuhkan auth (token).

---

#### POST /orders

**Auth:** User / Admin

> Checkout: Mengambil semua item di cart user, membuat order, mengurangi stock, lalu menghapus cart.

**Request Body:**

| Field   | Type   | Required | Description         |
| ------- | ------ | -------- | ------------------- |
| address | string | Yes      | Alamat pengiriman   |
| note    | string | No       | Catatan untuk order |

**Response 201:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "userId": "1",
    "userName": "Hilmi",
    "userEmail": "hilmi@example.com",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "note": "Tolong kirim sebelum jam 5 sore",
    "totalPrice": 29997000,
    "status": "pending",
    "items": [
      {
        "productId": "1",
        "productName": "Samsung Galaxy S24",
        "productImage": "https://example.com/s24.jpg",
        "quantity": 2,
        "price": 12999000,
        "subtotal": 25998000
      },
      {
        "productId": "2",
        "productName": "Nintendo Switch 2",
        "productImage": "https://example.com/switch2.jpg",
        "quantity": 1,
        "price": 3999000,
        "subtotal": 3999000
      }
    ],
    "createdAt": "2026-07-16T06:00:00.000Z"
  }
}
```

> **Behavior:**
> - Semua item di cart user akan dipindahkan ke order
> - Stock product otomatis dikurangi
> - Cart user dikosongkan setelah checkout
> - Status default: `"pending"`

**Error Responses:**

| Status | Message                                    |
| ------ | ------------------------------------------ |
| 400    | Cart is empty                               |
| 400    | Insufficient stock for product [nama]       |
| 404    | Product with id [id] not found              |

---

#### GET /orders

**Auth:** User / Admin

> Mengembalikan semua order milik user yang sedang login, diurutkan dari yang terbaru.

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 2,
      "userId": "1",
      "userName": "Hilmi",
      "userEmail": "hilmi@example.com",
      "address": "Jl. Sudirman No. 123, Jakarta",
      "note": "",
      "totalPrice": 12999000,
      "status": "paid",
      "items": [
        {
          "productId": "1",
          "productName": "Samsung Galaxy S24",
          "productImage": "https://example.com/s24.jpg",
          "quantity": 1,
          "price": 12999000,
          "subtotal": 12999000
        }
      ],
      "createdAt": "2026-07-16T07:00:00.000Z"
    },
    {
      "id": 1,
      "userId": "1",
      "userName": "Hilmi",
      "userEmail": "hilmi@example.com",
      "address": "Jl. Sudirman No. 123, Jakarta",
      "note": "Tolong kirim sebelum jam 5 sore",
      "totalPrice": 29997000,
      "status": "delivered",
      "items": [],
      "createdAt": "2026-07-16T06:00:00.000Z"
    }
  ]
}
```

> User hanya bisa melihat order miliknya sendiri. Diurutkan by `createdAt` descending.

---

#### GET /orders/:id

**Auth:** User / Admin

**Params:**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | number | Order ID    |

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "userId": "1",
    "userName": "Hilmi",
    "userEmail": "hilmi@example.com",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "note": "Tolong kirim sebelum jam 5 sore",
    "totalPrice": 29997000,
    "status": "pending",
    "items": [
      {
        "productId": "1",
        "productName": "Samsung Galaxy S24",
        "productImage": "https://example.com/s24.jpg",
        "quantity": 2,
        "price": 12999000,
        "subtotal": 25998000
      }
    ],
    "createdAt": "2026-07-16T06:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message         |
| ------ | --------------- |
| 404    | Order not found |

---

#### GET /orders/:id/receipt

**Auth:** User / Admin

> Mengembalikan struk/receipt untuk order tertentu.

**Params:**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | number | Order ID    |

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "receipt": {
      "orderId": 1,
      "storeName": "Nusafone Electronic Store",
      "date": "2026-07-16T06:00:00.000Z",
      "customer": {
        "name": "Hilmi",
        "email": "hilmi@example.com",
        "address": "Jl. Sudirman No. 123, Jakarta"
      },
      "items": [
        {
          "name": "Samsung Galaxy S24",
          "image": "https://example.com/s24.jpg",
          "quantity": 2,
          "price": 12999000,
          "subtotal": 25998000
        },
        {
          "name": "Nintendo Switch 2",
          "image": "https://example.com/switch2.jpg",
          "quantity": 1,
          "price": 3999000,
          "subtotal": 3999000
        }
      ],
      "note": "Tolong kirim sebelum jam 5 sore",
      "totalPrice": 29997000,
      "status": "pending"
    }
  }
}
```

**Error Responses:**

| Status | Message         |
| ------ | --------------- |
| 404    | Order not found |

---

#### PATCH /orders/:id/status

**Auth:** Admin only

**Params:**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | number | Order ID    |

**Request Body:**

| Field  | Type   | Required | Description                               |
| ------ | ------ | -------- | ----------------------------------------- |
| status | string | Yes      | Status baru (lihat valid values di bawah) |

**Valid Status Values:**

| Value        | Description          |
| ------------ | -------------------- |
| `pending`    | Menunggu pembayaran  |
| `paid`       | Sudah dibayar        |
| `processing` | Sedang diproses      |
| `shipped`    | Sudah dikirim        |
| `delivered`  | Sudah diterima       |
| `cancelled`  | Dibatalkan           |

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "userId": "1",
    "userName": "Hilmi",
    "userEmail": "hilmi@example.com",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "note": "Tolong kirim sebelum jam 5 sore",
    "totalPrice": 29997000,
    "status": "paid",
    "items": [],
    "createdAt": "2026-07-16T06:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message                          |
| ------ | -------------------------------- |
| 403    | Only admin can update order status |
| 404    | Order not found                  |
| 400    | Cannot update cancelled order    |
| 400    | Cannot update delivered order    |
| 400    | Invalid status                   |

---

#### POST /orders/:id/cancel

**Auth:** User / Admin (hanya bisa batalkan order milik sendiri)

> Membatalkan order dengan status `pending`. Stock product akan dikembalikan.

**Params:**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | number | Order ID    |

**Response 200:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "userId": "1",
    "userName": "Hilmi",
    "userEmail": "hilmi@example.com",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "note": "Tolong kirim sebelum jam 5 sore",
    "totalPrice": 29997000,
    "status": "cancelled",
    "items": [],
    "createdAt": "2026-07-16T06:00:00.000Z"
  }
}
```

> **Behavior:**
> - Hanya bisa dibatalkan jika status masih `pending`
> - Stock product otomatis dikembalikan

**Error Responses:**

| Status | Message                              |
| ------ | ------------------------------------ |
| 404    | Order not found                      |
| 400    | Only pending orders can be cancelled |

---

## 5. Data Models (Firestore Collections)

### 5.1 users

| Field     | Type   | Description                         |
| --------- | ------ | ----------------------------------- |
| id        | number | Auto-increment ID (string di Firestore) |
| name      | string | Nama lengkap                        |
| email     | string | Email (unique)                      |
| password  | string | Hashed password (bcrypt)            |
| role      | string | `"user"` atau `"admin"`             |
| createdAt | string | ISO 8601 timestamp                  |

### 5.2 categories

| Field     | Type   | Description             |
| --------- | ------ | ----------------------- |
| id        | number | Auto-increment ID       |
| name      | string | Nama category           |
| image     | string | URL gambar (nullable)   |
| createdAt | string | ISO 8601 timestamp      |

### 5.3 products

| Field      | Type   | Description                              |
| ---------- | ------ | ---------------------------------------- |
| id         | number | Auto-increment ID                        |
| name       | string | Nama product                             |
| description| string | Deskripsi product                        |
| price      | number | Harga dalam Rupiah                       |
| stock      | number | Stok tersedia                            |
| imageUrl   | string | URL gambar product                       |
| categoryId | string | ID category (disimpan sebagai string)    |
| createdAt  | string | ISO 8601 timestamp                       |

### 5.4 cart

| Field     | Type   | Description             |
| --------- | ------ | ----------------------- |
| id        | number | Auto-increment ID       |
| userId    | string | ID user (string)        |
| productId | string | ID product (string)     |
| quantity  | number | Jumlah item             |

### 5.5 orders

| Field      | Type   | Description                    |
| ---------- | ------ | ------------------------------ |
| id         | number | Auto-increment ID              |
| userId     | string | ID user (string)               |
| userName   | string | Snapshot nama user             |
| userEmail  | string | Snapshot email user            |
| address    | string | Alamat pengiriman              |
| note       | string | Catatan order                  |
| totalPrice | number | Total harga semua item         |
| status     | string | Status order                   |
| items      | array  | Array of order items           |
| createdAt  | string | ISO 8601 timestamp             |

**Order Item Structure:**

| Field        | Type   | Description              |
| ------------ | ------ | ------------------------ |
| productId    | string | ID product               |
| productName  | string | Snapshot nama product    |
| productImage | string | Snapshot URL gambar      |
| quantity     | number | Jumlah yang dipesan      |
| price        | number | Harga satuan saat order  |
| subtotal     | number | price x quantity         |

### 5.6 counters

| Field | Type   | Description                              |
| ----- | ------ | ---------------------------------------- |
| name  | string | Nama collection (users, products, dll)   |
| value | number | ID terakhir yang digunakan               |

> Digunakan oleh `getNextId()` untuk auto-increment ID.

---

## 6. Order Status Flow

```
pending ──→ paid ──→ processing ──→ shipped ──→ delivered
   │
   └──→ cancelled
```

| Dari         | Ke           | Siapa  | Keterangan              |
| ------------ | ------------ | ------ | ----------------------- |
| (saat buat)  | `pending`    | System | Default saat checkout   |
| `pending`    | `paid`       | Admin  | User sudah bayar        |
| `paid`       | `processing` | Admin  | Sedang disiapkan        |
| `processing` | `shipped`    | Admin  | Sudah dikirim           |
| `shipped`    | `delivered`  | Admin  | Sudah diterima user     |
| `pending`    | `cancelled`  | User   | User batalkan sendiri   |

**Batasan:**
- Order `cancelled` tidak bisa diubah statusnya
- Order `delivered` tidak bisa diubah statusnya
- User hanya bisa batalkan order dengan status `pending`

---

## 7. Frontend Architecture

### 7.1 Routing Table

| Page                | Path                  | Auth Required | Role    |
| ------------------- | --------------------- | ------------- | ------- |
| Home                | `/`                   | No            | Any     |
| Product Detail      | `/products/:id`       | No            | Any     |
| Category Products   | `/categories/:id`     | No            | Any     |
| Login               | `/login`              | No            | Any     |
| Register            | `/register`           | No            | Any     |
| Profile             | `/profile`            | Yes           | Any     |
| Cart                | `/cart`               | Yes           | Any     |
| Checkout            | `/checkout`           | Yes           | Any     |
| Orders              | `/orders`             | Yes           | Any     |
| Order Detail        | `/orders/:id`         | Yes           | Any     |
| Order Receipt       | `/orders/:id/receipt` | Yes           | Any     |
| Admin Categories    | `/admin/categories`   | Yes           | Admin   |
| Admin Products      | `/admin/products`     | Yes           | Admin   |
| Admin Orders        | `/admin/orders`       | Yes           | Admin   |

### 7.2 Component Tree

```
App
├── Navbar (public)
│   ├── Logo
│   ├── Search
│   ├── Cart Icon (with badge count) [auth]
│   └── User Menu [auth]
│       ├── Profile
│       ├── Admin Panel [admin]
│       └── Logout
│
├── Pages
│   ├── HomePage
│   │   ├── CategoryList
│   │   └── ProductGrid
│   │       └── ProductCard
│   │
│   ├── ProductDetailPage
│   │   ├── ProductImage
│   │   ├── ProductInfo
│   │   └── AddToCartButton [auth]
│   │
│   ├── LoginPage
│   │   └── LoginForm
│   │
│   ├── RegisterPage
│   │   └── RegisterForm
│   │
│   ├── ProfilePage
│   │   └── UserInfo
│   │
│   ├── CartPage
│   │   └── CartItem
│   │       ├── QuantityControl
│   │       ├── RemoveButton
│   │       └── ProductInfo
│   │
│   ├── CheckoutPage
│   │   ├── AddressForm
│   │   └── OrderSummary
│   │
│   ├── OrdersPage
│   │   └── OrderList
│   │       └── OrderCard
│   │
│   ├── OrderDetailPage
│   │   ├── OrderInfo
│   │   ├── OrderItems
│   │   ├── CancelButton [pending]
│   │   └── ReceiptButton
│   │
│   ├── ReceiptPage
│   │   └── ReceiptPrint
│   │
│   └── Admin/
│       ├── AdminCategoriesPage
│       │   ├── CategoryForm
│       │   └── CategoryList
│       │
│       ├── AdminProductsPage
│       │   ├── ProductForm
│       │   └── ProductList
│       │
│       └── AdminOrdersPage
│           ├── OrderFilter
│           └── OrderList
│               └── OrderCard
│                   └── StatusDropdown
│
└── Footer (public)
```

### 7.3 State Management

**Auth State:**

```typescript
interface AuthState {
  token: string | null;        // JWT access_token
  user: User | null;           // User profile
  isAuthenticated: boolean;    // token !== null
  isAdmin: boolean;            // user?.role === 'admin'
}
```

**Cart State:**

```typescript
interface CartState {
  items: CartItem[];           // Cart items dengan product info
  totalItems: number;          // Jumlah total item di cart
  totalPrice: number;          // Total harga semua item
}
```

---

## 8. Page Implementation Guide

### 8.1 Auth Pages

#### Login Page

| Field    | Component | Validation         |
| -------- | --------- | ------------------ |
| email    | Input     | Required, email    |
| password | Input     | Required, min 6    |

**Flow:**
1. User isi form login
2. `POST /auth/login` dengan email + password
3. Simpan `access_token` ke localStorage / context
4. Fetch user profile: `GET /auth/profile`
5. Simpan user data ke state
6. Redirect ke home page

**Error Handling:**
- `401`: Tampilkan "Email atau password salah"

---

#### Register Page

| Field           | Component | Validation              |
| --------------- | --------- | ----------------------- |
| name            | Input     | Required                |
| email           | Input     | Required, email format  |
| password        | Input     | Required, min 6         |
| confirmPassword | Input     | Required, must match    |

**Flow:**
1. User isi form register
2. Validasi client-side: password === confirmPassword
3. `POST /auth/register` dengan semua field
4. Redirect ke login page

**Error Handling:**
- `400`: "Password dan confirm password tidak cocok"
- `409`: "Email sudah terdaftar"

---

### 8.2 Home Page

**API yang dipakai:**
- `GET /categories` - Untuk filter/kategori navigation
- `GET /products` - Untuk menampilkan semua products

**Flow:**
1. Fetch categories saat mount
2. Fetch products saat mount
3. Tampilkan categories sebagai filter/tab
4. Tampilkan products dalam grid
5. Klik product → redirect ke `/products/:id`
6. Klik category → filter products atau redirect ke `/categories/:id`

---

### 8.3 Product Detail Page

**API yang dipakai:**
- `GET /products/:id` - Detail product

**Flow:**
1. Fetch product berdasarkan ID dari URL params
2. Tampilkan gambar, nama, deskripsi, harga, stok
3. Tampilkan category name
4. Jika user login: tampilkan "Tambah ke Cart" button
5. Jika user belum login: tampilkan "Login untuk membeli"
6. Klik "Tambah ke Cart": `POST /cart` dengan productId + quantity

**Error Handling:**
- `404`: Tampilkan "Product tidak ditemukan"

---

### 8.4 Cart Page

**API yang dipakai:**
- `GET /cart` - Ambil semua cart items
- `PATCH /cart/:id` - Update quantity
- `DELETE /cart/:id` - Hapus item dari cart

**Flow:**
1. Fetch cart items saat mount
2. Tampilkan setiap item dengan:
   - Product image + name
   - Price per item
   - Quantity control (+ / -)
   - Subtotal per item
   - Remove button
3. Hitung total price di client
4. Update quantity: `PATCH /cart/:id` dengan quantity baru
5. Hapus item: `DELETE /cart/:id`
6. Klik "Checkout" → redirect ke `/checkout`

**Error Handling:**
- `400`: "Stok tidak mencukupi" (saat update quantity)

---

### 8.5 Checkout Page

**API yang dipakai:**
- `GET /cart` - Ambil cart items untuk preview
- `POST /orders` - Checkout

**Flow:**
1. Fetch cart items untuk menampilkan order summary
2. Form: address (required), note (optional)
3. Tampilkan order summary:
   - List items dengan harga
   - Total price
4. Klik "Bayar" → `POST /orders` dengan address + note
5. Redirect ke `/orders/:id` (order detail)
6. Cart otomatis kosong

**Error Handling:**
- `400`: "Cart kosong"
- `400`: "Stok tidak mencukupi untuk product [nama]"

---

### 8.6 Order History Page

**API yang dipakai:**
- `GET /orders` - Ambil semua orders

**Flow:**
1. Fetch orders saat mount
2. Tampilkan list orders dengan:
   - Order ID
   - Date
   - Status (dengan warna badge)
   - Total price
   - Jumlah items
3. Klik order → redirect ke `/orders/:id`

---

### 8.7 Order Detail Page

**API yang dipakai:**
- `GET /orders/:id` - Detail order
- `POST /orders/:id/cancel` - Batalkan order
- `GET /orders/:id/receipt` - Lihat receipt

**Flow:**
1. Fetch order berdasarkan ID
2. Tampilkan:
   - Order info (ID, date, status)
   - Customer info (name, email, address)
   - Items list dengan product snapshot
   - Total price
   - Note
3. Jika status `pending`: tampilkan "Batalkan Order" button
4. Klik "Batalkan" → konfirmasi → `POST /orders/:id/cancel`
5. Klik "Lihat Receipt" → redirect ke `/orders/:id/receipt`

---

### 8.8 Receipt Page

**API yang dipakai:**
- `GET /orders/:id/receipt` - Ambil data receipt

**Flow:**
1. Fetch receipt data
2. Tampilkan struk dengan format:
   - Store name: "Nusafone Electronic Store"
   - Order ID
   - Date
   - Customer info
   - Items list (name, qty, price, subtotal)
   - Note
   - Total price
   - Status
3. (Optional) Tampilkan tombol "Print"

---

### 8.9 Admin: Categories Management

**API yang dipakai:**
- `GET /categories` - List categories
- `POST /categories` - Tambah category
- `PATCH /categories/:id` - Edit category
- `DELETE /categories/:id` - Hapus category

**Flow:**
1. Fetch categories saat mount
2. Tampilkan table/list categories
3. Tambah: buka form modal → isi name + image → `POST /categories`
4. Edit: klik edit → isi form dengan data existing → `PATCH /categories/:id`
5. Hapus: konfirmasi → `DELETE /categories/:id`

---

### 8.10 Admin: Products Management

**API yang dipakai:**
- `GET /products` - List products
- `GET /categories` - Untuk dropdown category
- `POST /products` - Tambah product
- `PATCH /products/:id` - Edit product
- `DELETE /products/:id` - Hapus product

**Flow:**
1. Fetch products + categories saat mount
2. Tampilkan table/list products dengan category name
3. Tambah: buka form modal → isi semua field → pilih category dari dropdown → `POST /products`
4. Edit: klik edit → isi form dengan data existing → `PATCH /products/:id`
5. Hapus: konfirmasi → `DELETE /products/:id`

---

### 8.11 Admin: Orders Management

**API yang dipakai:**
- `GET /orders` - List semua orders (dari semua user)
- `PATCH /orders/:id/status` - Update status order

**Flow:**
1. Fetch orders saat mount
2. Tampilkan table orders dengan:
   - Order ID
   - Customer name + email
   - Date
   - Total price
   - Status (dropdown)
3. Update status: pilih status baru dari dropdown → `PATCH /orders/:id/status`
4. Klik order → lihat detail

> **Note:** Admin melihat semua orders, bukan hanya miliknya sendiri.

---

## 9. Error Handling

### 9.1 Client-Side Error Handler

```typescript
interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
}

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!data.success) {
    // Handle error berdasarkan statusCode
    switch (data.statusCode) {
      case 400:
        // Bad request - tampilkan message
        throw new Error(data.message);
      case 401:
        // Unauthorized - redirect ke login
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        // Forbidden - user tidak punya akses
        throw new Error('Anda tidak memiliki akses');
      case 404:
        // Not found
        throw new Error(data.message || 'Data tidak ditemukan');
      case 409:
        // Conflict - email sudah ada
        throw new Error(data.message);
      default:
        throw new Error('Terjadi kesalahan');
    }
  }

  return data.data;
}
```

### 9.2 Common Error Messages

| Endpoint              | Error Message                                    |
| --------------------- | ------------------------------------------------ |
| POST /auth/login      | Invalid credentials                              |
| POST /auth/register   | Email already registered                         |
| POST /auth/register   | Password and confirm password do not match       |
| POST /cart            | Insufficient stock                               |
| POST /orders          | Cart is empty                                    |
| POST /orders          | Insufficient stock for product [nama]            |
| POST /orders/:id/cancel | Only pending orders can be cancelled           |
| PATCH /orders/:id/status | Cannot update cancelled order                 |
| PATCH /orders/:id/status | Cannot update delivered order                 |
| PATCH /orders/:id/status | Invalid status                               |
| * /categories/*       | Only admin can [create/update/delete] categories |
| * /products/*         | Only admin can [create/update/delete] products   |

---

## 10. Notes & Gotchas

1. **ID selalu number** - Semua `id` di response berupa number (walaupun disimpan sebagai string di Firestore)

2. **categoryId di request = number** - Kirim `categoryId` sebagai number, bukan string

3. **Category join di backend** - Product response sudah include object `category`, tidak perlu fetch ulang

4. **Product join di cart** - Cart response sudah include object `product`, tidak perlu fetch ulang

5. **Order items snapshot** - Data product di order adalah snapshot saat checkout, tidak berubah jika product di-update

6. **Sort di backend** - Orders diurutkan by `createdAt` descending (terbaru di atas)

7. **Cart duplicate handling** - Jika add product yang sudah ada di cart, quantity otomatis ditambah

8. **Checkout = ambil dari cart** - POST /orders tidak perlu kirim items, otomatis ambil dari cart user

9. **Cancel = kembalikan stock** - Membatalkan order mengembalikan stock product

10. **Password never returned** - Field `password` tidak pernah muncul di response manapun

11. **Token storage** - Simpan token di localStorage atau sessionStorage, bersihkan saat logout

12. **Unauthorized handling** - Jika dapat 401, redirect ke login page

13. **Admin check** - Cek `user.role === 'admin'` untuk show/hide admin features

14. **Price format** - Harga dalam Rupiah, format sebagai `Rp 12.999.000`

15. **Status badge** - Beri warna berbeda untuk setiap status order:
    - `pending` → kuning
    - `paid` → biru
    - `processing` → ungu
    - `shipped` → orange
    - `delivered` → hijau
    - `cancelled` → merah

---

## 11. Complete API Endpoint Summary

| No | Method | Endpoint                  | Auth  | Description                    |
|----|--------|---------------------------|-------|--------------------------------|
| 1  | POST   | /auth/register            | Public| Register user baru             |
| 2  | POST   | /auth/login               | Public| Login, dapatkan token          |
| 3  | GET    | /auth/profile             | User  | Lihat profile (via auth)       |
| 4  | GET    | /users/profile            | User  | Lihat profile (via users)      |
| 5  | GET    | /categories               | Public| Lihat semua category           |
| 6  | GET    | /categories/:id           | Public| Lihat category + produknya     |
| 7  | POST   | /categories               | Admin | Tambah category                |
| 8  | PATCH  | /categories/:id           | Admin | Edit category                  |
| 9  | DELETE | /categories/:id           | Admin | Hapus category                 |
| 10 | GET    | /products                 | Public| Lihat semua product            |
| 11 | GET    | /products/category/:id    | Public| Lihat product per category     |
| 12 | GET    | /products/:id             | Public| Lihat detail product           |
| 13 | POST   | /products                 | Admin | Tambah product                 |
| 14 | PATCH  | /products/:id             | Admin | Edit product                   |
| 15 | DELETE | /products/:id             | Admin | Hapus product                  |
| 16 | GET    | /cart                     | User  | Lihat cart saya                |
| 17 | POST   | /cart                     | User  | Tambah ke cart                 |
| 18 | PATCH  | /cart/:id                 | User  | Update jumlah di cart          |
| 19 | DELETE | /cart/:id                 | User  | Hapus dari cart                |
| 20 | POST   | /orders                   | User  | Checkout (dari cart)           |
| 21 | GET    | /orders                   | User  | Lihat semua order saya         |
| 22 | GET    | /orders/:id               | User  | Lihat detail order             |
| 23 | GET    | /orders/:id/receipt       | User  | Lihat struk/receipt order      |
| 24 | PATCH  | /orders/:id/status        | Admin | Update status order            |
| 25 | POST   | /orders/:id/cancel        | User  | Batalkan order (pending saja)  |

