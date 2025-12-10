
export enum Role {
    COURIER = 'courier',
    ADMIN = 'admin',
    ROOT_ADMIN = 'root-admin',
}

export interface User {
    id: string;
    username: string;
    fullName: string;
    role: Role;
    avatar?: string;
}

export enum CourierStatus {
    PENDING = 'در انتظار تایید',
    APPROVED = 'تایید شده',
    INACTIVE = 'غیرفعال',
}

export interface Courier extends User {
    nationalId: string;
    phone: string;
    address: string;
    status: CourierStatus;
    isOnline: boolean;
    location: { lat: number; lng: number }; // For map
    vehicleType?: string;
}

export interface Address {
    id: string;
    title: string; // e.g., "Home", "Office"
    fullAddress: string;
    location: { lat: number; lng: number };
}

export interface Customer {
    id: string;
    fullName: string;
    phone: string;
    addresses: Address[];
    createdAt: string;
}

export enum OrderStatus {
    NEW = 'جدید',
    ASSIGNED = 'اختصاص یافته',
    IN_TRANSIT = 'در حال حمل',
    DELIVERED = 'تحویل شده',
    CANCELLED = 'لغو شده',
}

export interface Order {
    id: string;
    customerName: string;
    pickupAddress: string;
    deliveryAddress: string;
    pickupLocation: { lat: number; lng: number };
    deliveryLocation: { lat: number; lng: number };
    status: OrderStatus;
    assignedCourierId?: string;
    price: number;
    createdAt: string;
}

export interface Wallet {
    balance: number;
    cardNumber: string;
    shabaNumber: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai' | 'admin';
    text: string;
    timestamp: number;
}
