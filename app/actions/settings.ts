"use server";

import dbConnect from "@/app/lib/mongoDB";
import Company from "@/models/Company";
import { revalidatePath } from "next/cache";

// Helper (same as before)
async function getCompanyId() {
    const company = await Company.findOne().sort({ createdAt: -1 });
    return company?._id;
}

export async function getCompanySettings() {
    await dbConnect();
    const companyId = await getCompanyId();
    if (!companyId) return null;

    const company = await Company.findById(companyId).lean();
    if (!company) return null;

    return {
        _id: company._id.toString(),
        name: company.name,
        email: company.email,
        logo: company.logo,
        plan: company.plan,
        subscriptionExpiresAt: company.subscriptionExpiresAt ? company.subscriptionExpiresAt.toISOString() : null,
    };
}

export async function updateCompanySettings(data: { logo?: string; email?: string }) {
    await dbConnect();
    const companyId = await getCompanyId();
    if (!companyId) return { success: false, error: "No company found" };

    try {
        await Company.findByIdAndUpdate(companyId, data);
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function extendSubscription() {
    // Mock payment/extension logic
    await dbConnect();
    const companyId = await getCompanyId();
    if (!companyId) return { success: false, error: "No company found" };

    try {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        await Company.findByIdAndUpdate(companyId, {
            plan: "PAID",
            subscriptionExpiresAt: nextMonth
        });
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
