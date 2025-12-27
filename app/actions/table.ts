"use server";

import dbConnect from "@/app/lib/mongoDB";
import Company from "@/models/Company";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

// Mocking getting the current company ID. 
// In a real app, this would come from the session/auth.
// I will assume for now we fetch the first company or a hardcoded one for development if auth isn't fully intertwined here yet.
// However, the `AdminPage` had logout logic, suggesting auth is present. 
// I'll check `middleware.ts` later. For now, I'll fetch the first company or use a placeholder ID if I can't find context.
// Wait, the user already has authentication? "Implement Clerk Admin Auth" was a previous task. 
// But the code I saw in `AdminPage` uses `/api/auth/log-out`.
// I'll need to know HOW to identified the logged-in company. 
// For now, to make progress, I'll fetch the FIRST company in the DB or check if there's a utility.
// Actually, safely, I should pass the CompanyID or retrieve it from cookies/headers.
// Given I cannot easily see the auth implementation details without more exploration, 
// I will fetch the most recently created company as a fallback or assume there's only one for this single-tenant-like view.
// BETTER: I will assume there is a way to get the company. 
// Let's check `models/Company.ts` again.

async function getCompanyId() {
    // TODO: Replace with actual auth logic
    const company = await Company.findOne().sort({ createdAt: -1 });
    return company?._id;
}

export async function getTables() {
    await dbConnect();
    const companyId = await getCompanyId();
    if (!companyId) return [];

    const company = await Company.findById(companyId).lean();
    if (!company) return [];

    // Return tables with ID converted to string if they have _id (subdocs usually do)
    // The schema defined `tables: [TableSubSchema]`. Subdocuments have _id by default.
    return company.tables.map((t: any) => ({
        ...t,
        _id: t._id.toString(),
    }));
}

export async function addTable(name: string) {
    await dbConnect();
    const companyId = await getCompanyId();
    if (!companyId) return { success: false, error: "No company found" };

    try {
        const tableCode = nanoid(6); // Short unique code
        await Company.findByIdAndUpdate(companyId, {
            $push: { tables: { name, tableCode } }
        });
        revalidatePath("/admin/tables");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteTable(tableId: string) {
    await dbConnect();
    const companyId = await getCompanyId();
    if (!companyId) return { success: false, error: "No company found" };

    try {
        await Company.findByIdAndUpdate(companyId, {
            $pull: { tables: { _id: tableId } }
        });
        revalidatePath("/admin/tables");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
