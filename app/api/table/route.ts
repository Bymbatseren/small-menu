import { NextResponse } from "next/server";
import DBConnect from "@/app/lib/mongoDB";
import Company from "@/models/Company";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await DBConnect();
    const cookieStore = await cookies();
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
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "Table name оруулна уу" },
        { status: 400 }
      );
    }
    const newTable = { name, tableCode: undefined }; 
    company.tables.push(newTable);
    await company.save();
    return NextResponse.json(
      {
        message: "Шинэ table амжилттай нэмэгдлээ",
        table: company.tables[company.tables.length - 1], 
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
    const cookieStore = await cookies();
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
    return NextResponse.json({
      tables: company.tables,
      count: company.tables.length,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
