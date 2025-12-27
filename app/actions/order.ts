"use server";

import dbConnect from "@/app/lib/mongoDB";
import Order from "@/models/Order";
import "@/models/Item"; // Ensure Item model is registered
import { revalidatePath } from "next/cache";

// Helper to get company (stubbed as before)
// In real app, filter by company ID
import Company from "@/models/Company";
async function getCompanyId() {
    const company = await Company.findOne().sort({ createdAt: -1 });
    return company?._id;
}

export async function getOrders() {
    await dbConnect();
    const companyId = await getCompanyId();
    if (!companyId) return [];

    // Populate items.item to get details like name/price
    // Assuming 'items.item' ref in Order model points to 'Item'
    const orders = await Order.find({ company: companyId })
        .populate({
            path: "items.item",
            select: "title price"
        })
        .sort({ createdAt: -1 })
        .lean();

    return orders.map((order: any) => ({
        ...order,
        _id: order._id.toString(),
        company: order.company.toString(),
        items: order.items.map((i: any) => ({
            ...i,
            _id: i._id?.toString(),
            item: i.item ? { ...i.item, _id: i.item._id.toString() } : null
        })),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
    }));
}

export async function updateOrderStatus(orderId: string, status: string) {
    await dbConnect();
    try {
        await Order.findByIdAndUpdate(orderId, { status });
        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
