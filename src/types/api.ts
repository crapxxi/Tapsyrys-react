// ─── Auth ────────────────────────────────────────────────────────────────────

export interface RegUserRequest {
  phone: string;
  email: string;
  password: string;
}

export type UserRole = 'USER' | 'ADMIN' | 'MANAGER' | 'OPERATOR';

export interface UserResponse {
  id: number;
  phone: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  loginData: string;
  password: string;
}

export interface JwtResponse {
  loginData: string;
  token: string;
}

// ─── Organization ────────────────────────────────────────────────────────────

export type OrgType = 'SUPPLIER' | 'SHOP';

export interface RegOrgRequest {
  name: string;
  address: string;
  type: OrgType;
  city: string;
  bin: string;
  category: string;
}

export interface OrganizationResponse {
  id: number;
  name: string;
  logoUrl: string;
  hasProduct: boolean;
  address: string;
  type: OrgType;
  city: string;
  bin: string;
  category: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface CategoryResponse {
  id: number;
  name: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface ProductRequest {
  name: string;
  sku: string;
  basePrice: number;
  count: number;
  description: string;
  categoryId: number;
}

export interface ProductResponse {
  id: number;
  organizationId: number;
  name: string;
  sku: string;
  basePrice: number;
  count: number;
  description: string;
  imageUrl: string;
  category: CategoryResponse;
}

// ─── Recommendation ──────────────────────────────────────────────────────────

export interface Recommendation {
  id: number;
  name: string;
  hashtag: string;
  reason: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItemRequest {
  productId: number;
  count: number;
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  price: number;
  count: number;
}

export interface OrderRequest {
  supplierId: number;
  orderItems: OrderItemRequest[];
}

export interface OrderResponse {
  id: number;
  supplierId: number;
  supplierName: string;
  shopId: number;
  shopName: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  orderItems: OrderItemResponse[];
}
