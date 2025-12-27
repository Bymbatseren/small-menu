"use server";

import dbConnect from "@/app/lib/mongoDB";
import Item, { IItem } from "@/models/Item";
import Category, { ICategory } from "@/models/Category";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Company from "@/models/Company";

const JWT_SECRET = process.env.JWT_SECRET!
export async function createCategory(name: string) {
    await dbConnect();

    try {
        const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");
        const newCategory = await Category.create({ name, slug });
        revalidatePath("/admin/menu");
        return { success: true, category: JSON.parse(JSON.stringify(newCategory)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


// --- Items ---


export async function getItems() {
    await dbConnect();

    const items = await Item.find({})
        .sort({ createdAt: -1 })
        .populate('category');

    return items.map((item: any) => ({
        _id: item._id.toString(),
        title: item.title,
        description: item.description || null,
        image: item.image || null,
        price: item.price,
        isActive: item.isActive,
        company: item.company.toString(),

        // Обьект бүтэн буцаана – нэр ч, ID ч хэрэглэж болно
        category: item.category
            ? {
                _id: item.category._id.toString(),
                name: item.category.name,
                slug: item.category.slug || null,
            }
            : null,

        // Нэмэлтээр нэр дангаар нь (карт дээр хялбар ашиглахад)
        categoryName: item.category ? item.category.name : "Категоригүй",

        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }));
}
export async function getItemById(id: string) {
    await dbConnect();
    const item = await Item.findById(id).lean();
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
        const newItem = await Item.create(data);
        revalidatePath("/admin/menu");
        return { success: true, item: JSON.parse(JSON.stringify(newItem)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Fixed casing issue above: 'item.create' should be 'Item.create'
// I'll rewrite the function correctly below in the file content.

export async function createItemCorrect(data: any) {
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
        const newItem = await Item.create({
            ...data,
            price: Number(data.price),
            company: payload.id
        });
        revalidatePath("/admin/menu");
        return { success: true, item: JSON.parse(JSON.stringify(newItem)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateItem(id: string, data: any) {
    await dbConnect();
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { ...data, price: Number(data.price) },
            { new: true }
        );
        revalidatePath("/admin/menu");
        return { success: true, item: JSON.parse(JSON.stringify(updatedItem)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteItem(id: string) {
    await dbConnect();
    try {
        await Item.findByIdAndDelete(id);
        revalidatePath("/admin/menu");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function toggleItemVisibility(id: string, currentStatus: boolean) {
    await dbConnect();
    try {
        await Item.findByIdAndUpdate(id, { isActive: !currentStatus });
        revalidatePath("/admin/menu");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- Categories ---

export async function getCategories() {
    await dbConnect();
    const categories = await Category.find({}).sort({ order: 1 }).lean();
    return categories.map((cat: any) => ({
        ...cat,
        _id: cat._id.toString(),
        name: cat.name.toString(),
        slug: cat.slug.toString(),
        createdAt: cat.createdAt.toISOString(),
        updatedAt: cat.updatedAt.toISOString(),
    }));
}
export async function getOneCategory(id:string) {
  await dbConnect();

  try {
    // token авах
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    if (!tokenCookie) {
      return { success: false, error: "Нэвтрээгүй байна. Токен олдсонгүй." };
    }

    // MongoDB query
    const item = await Item.findById(id);
    if(!item){
        return {success:false ,error:"Category олдсонгүй."}
    }
    const category = await Category.findById(item.category)   

    if (!category) {
      return { success: false, error: "Category олдсонгүй." };
    } 
    return {
      success: true,
      item: JSON.parse(JSON.stringify(category)),
    };

  } catch (error: any) {
    return { success: false, error: error.message || "Алдаа гарлаа" };
  }
}


export async function deleteCategory(id: string) {
    await dbConnect();
    try {
        await Category.findByIdAndDelete(id);
        revalidatePath("/admin/menu");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
