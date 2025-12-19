export type UserRole = 'farmer' | 'buyer' | 'admin';

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  location?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  description: string;
  category: string;
  pricePerKg: number;
  availableQuantity: number;
  unit: string;
  locationText: string;
  lat?: number;
  lng?: number;
  isHighDemand: boolean;
  isActive: boolean;
  imageUrl?: string;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerKg: number;
  farmerId: string;
  farmerName: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  isPaid: boolean;
  createdAt: Date;
  distanceKm: number;
}
