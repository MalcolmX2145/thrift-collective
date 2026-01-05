export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: 'MEN' | 'WOMEN' | 'UNISEX';
  subCategory: 'JACKETS' | 'JEANS' | 'SNEAKERS' | 'BAGS' | 'ACCESSORIES' | 'TOPS' | 'DRESSES';
  sizes: string[];
  condition: 'Like New' | 'Good' | 'Vintage';
  brand?: string;
  isSold: boolean;
  isNew: boolean;
  isTrending: boolean;
  isPremium: boolean;
  isDeal: boolean;
  measurements?: {
    chest?: string;
    length?: string;
    sleeve?: string;
    waist?: string;
    inseam?: string;
  };
  stock_quantity: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  avatar_url?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  delivery_fee: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shipping_full_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_delivery_option: string;
  created_at: string;
  items?: CartItem[]; // Optional as we might disjointly load them
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  deliveryOption: 'SAME_DAY' | 'NEXT_DAY' | 'PICKUP';
}

export type CollectionType = 'new-arrivals' | 'trending' | 'premium' | 'deals' | 'jackets';
