"use server";

import dbConnect from "@/app/lib/mongoDB";
import OrderModel from "@/models/Order";
import "@/models/Item"; // Ensure Item model is registered
import { revalidatePath } from "next/cache";

// Helper to get company (stubbed as before)
// In real app, filter by company ID
import Company from "@/models/Company";
async function getCompanyId() {
    const company = await Company.findOne().sort({ createdAt: -1 });
    return company?._id;
}

import { Order, OrderStatus } from "@/types";

export async function getOrders(): Promise<Order[]> {
    await dbConnect();
    const companyId = await getCompanyId();
    if (!companyId) return [];

    // Populate items.item to get details like name/price
    // Assuming 'items.item' ref in Order model points to 'Item'
    const orders = await OrderModel.find({ company: companyId })
        .populate({
            path: "items.item",
            select: "title price"
        })
        .sort({ createdAt: -1 })
        .lean();

    return orders.map((order: any) => ({
        _id: order._id.toString(),
        company: order.company.toString(),
        tableCode: order.tableCode,
        status: order.status as OrderStatus,
        total: order.total,
        items: order.items.map((i: any) => ({
            _id: i._id?.toString(),
            item: i.item ? { ...i.item, _id: i.item._id.toString() } : i.item?.toString(), // Handle populated or not
            quantity: i.quantity,
            note: i.note
        })),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
    }));
}

export async function updateOrderStatus(orderId: string, status: string) {
    await dbConnect();
    try {
        await OrderModel.findByIdAndUpdate(orderId, { status });
        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
