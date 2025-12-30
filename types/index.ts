export interface Category {
    _id: string;
    name: string;
    slug: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Item {
    _id: string;
    title: string;
    description?: string;
    image?: string;
    price: number;
    category?: Category | string | null; // Can be populated or just ID
    isActive: boolean;
    company: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    item: Item | string; // Can be populated or just ID
    quantity: number;
    note?: string;
    _id?: string;
}

export enum OrderStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export interface Order {
    _id: string;
    company: string;
    tableCode: string;
    items: OrderItem[];
    status: OrderStatus;
    total: number;
    createdAt: string; // ISO string for frontend compatibility
    updatedAt: string;
    completedAt?: string;
}

export interface Table {
    _id?: string;
    name?: string;
    tableCode: string;
}

export interface Company {
    _id: string;
    name: string;
    email: string;
    logo?: string;
    tables: Table[];
    plan: "FREE" | "PAID";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    subscriptionExpiresAt?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface Toast {
    id: number;
    message: string;
    type: "success" | "error";
}

export interface PageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}
