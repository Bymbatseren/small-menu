import DBConnect from "@/app/lib/mongoDB";
import Company from "@/models/Company";
import Item from "@/models/Item";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await DBConnect();
     const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value

    const { title, description, image, price, category, isActive } =
      await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token байхгүй" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const company = await Company.findOne({ email: decoded.email });

    if (!company) {
      return NextResponse.json(
        { error: "Company олдсонгүй" },
        { status: 404 }
      );
    }
    const item = await Item.create({
      title,
      description,
      image,
      price,
      category,
      isActive,
      company: company._id,
    });
    company.items.push(item._id);
    await company.save();

    return NextResponse.json(
      {
        message: "Item амжилттай нэмэгдлээ",
        item,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await DBConnect();
    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Нэвтрээгүй байна" },
        { status: 401 }
      );
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const company = await Company.findOne({ email: decoded.email });

    if (!company) {
      return NextResponse.json(
        { error: "Company олдсонгүй" },
        { status: 404 }
      );
    }
    const items = await Item.find({ company: company._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        items,
        count: items.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}