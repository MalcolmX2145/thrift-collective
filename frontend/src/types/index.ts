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
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED';
  shippingInfo: ShippingInfo;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  deliveryOption: 'SAME_DAY' | 'NEXT_DAY' | 'PICKUP';
}

export type CollectionType = 'new-arrivals' | 'trending' | 'premium' | 'deals' | 'jackets';
