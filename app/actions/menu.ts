"use server";

import dbConnect from "@/app/lib/mongoDB";
import ItemModel, { IItem } from "@/models/Item";
import CategoryModel from "@/models/Category";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { CategoryDoc, CategoryDTO, CreateItemInput, ItemDoc, UpdateItemInput } from "@/utils/types";

const JWT_SECRET = process.env.JWT_SECRET!
export async function createCategory(name: string) {
    await dbConnect();

    try {
        const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");
        const newCategory = await CategoryModel.create({ name, slug });
        revalidatePath("/admin/menu");
        return { success: true, category: JSON.parse(JSON.stringify(newCategory)) };
    } catch (error) {
        const message =
            error instanceof Error ? error.message : String(error);

        return { success: false, error: message };
    }

}


import { Item } from "@/types";

export async function getItems(): Promise<Item[]> {
    await dbConnect();

    const items = await ItemModel.find({})
        .sort({ createdAt: -1 })
        .populate('category');

    return items.map((item: any) => ({
        _id: item._id.toString(),
        title: item.title,
        description: item.description || "",
        image: item.image || "",
        price: item.price,
        isActive: item.isActive,
        company: item.company.toString(),
        category: item.category
            ? {
                _id: item.category._id.toString(),
                name: item.category.name,
                slug: item.category.slug || "",
                isActive: item.category.isActive ?? true, // ensure compatibility
                order: item.category.order ?? 0,
                createdAt: item.category.createdAt?.toISOString() || "",
                updatedAt: item.category.updatedAt?.toISOString() || ""
            }
            : null,
        categoryName: item.category ? item.category.name : "Категоригүй",

        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }));
}
export async function getItemById(id: string) {
    await dbConnect();
    const item = await ItemModel.findById(id).lean();
    if (!item) return null;

    return {
        ...item,
        _id: item._id.toString(),
        company: item.company?.toString(),
        category: item.category?.toString(),
        createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null,
        updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
    };
}

export async function createItem(data: Partial<IItem>) {
    await dbConnect();
    try {
        const newItem = await ItemModel.create(data);
        revalidatePath("/admin/menu");
        return { success: true, item: JSON.parse(JSON.stringify(newItem)) };
    } catch (error) {
        const message =
            error instanceof Error ? error.message : String(error);

        return { success: false, error: message };
    }

}
export async function createItemCorrect(data: CreateItemInput) {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")!.value
    if (!token) {
        return { success: false, error: "Нэвтрээгүй байна. Токен олдсонгүй." }
    }
    const price = data.price
    if (Number(price) < 0) {
        return { success: false, error: "Үнэ 0-ээс их байх ёстой" }
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET) as {
            email: string;
            id: string;
        };
        const newItem = await ItemModel.create({
            ...data,
            price: Number(data.price),
            company: payload.id
        });
        revalidatePath("/admin/menu");
        return { success: true, item: JSON.parse(JSON.stringify(newItem)) };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Тодорхойгүй алдаа гарлаа" };

    }
}

export async function updateItem(
    id: string,
    data: UpdateItemInput
) {
    await dbConnect();

    try {
        const { price, ...rest } = data;

        const updateData: UpdateItemInput & { price?: number } = {
            ...rest,
        };

        if (price !== undefined) {
            const numericPrice = Number(price);
            if (numericPrice < 0) {
                return { success: false, error: "Үнэ 0-ээс их байх ёстой" };
            }
            updateData.price = numericPrice;
        }

        const updatedItem = await ItemModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        revalidatePath("/admin/menu");

        return {
            success: true,
            item: JSON.parse(JSON.stringify(updatedItem)),
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Тодорхойгүй алдаа гарлаа" };
    }
}



export async function deleteItem(id: string) {
    await dbConnect();
    try {
        await ItemModel.findByIdAndDelete(id);
        revalidatePath("/admin/menu");
        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Тодорхойгүй алдаа гарлаа" };
    }
}

export async function toggleItemVisibility(id: string, currentStatus: boolean) {
    await dbConnect();
    try {
        await ItemModel.findByIdAndUpdate(id, { isActive: !currentStatus });
        revalidatePath("/admin/menu");
        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Тодорхойгүй алдаа гарлаа" };
    }
}
import { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
    await dbConnect();

    const categories = await CategoryModel.find({})
        .sort({ order: 1 })
        .lean<CategoryDoc[]>();

    return categories.map((cat) => ({
        _id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug ?? "",
        order: cat.order ?? 0,
        isActive: cat.isActive ?? true,
        createdAt: cat.createdAt.toISOString(),
        updatedAt: cat.updatedAt.toISOString(),
    }));
}

export async function getOneCategory(id: string) {
    await dbConnect();

    try {

        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("token");
        if (!tokenCookie) {
            return { success: false, error: "Нэвтрээгүй байна. Токен олдсонгүй." };
        }
        const item = await ItemModel.findById(id);
        if (!item) {
            return { success: false, error: "Category олдсонгүй." }
        }
        const category = await CategoryModel.findById(item.category)

        if (!category) {
            return { success: false, error: "Category олдсонгүй." };
        }
        return {
            success: true,
            item: JSON.parse(JSON.stringify(category)),
        };

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Тодорхойгүй алдаа гарлаа" };
    }
}


export async function deleteCategory(id: string) {
    await dbConnect();
    try {
        await CategoryModel.findByIdAndDelete(id);
        revalidatePath("/admin/menu");
        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Тодорхойгүй алдаа гарлаа" };
    }
}
