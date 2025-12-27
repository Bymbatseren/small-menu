import { NextRequest, NextResponse } from "next/server";
import DBConnect from "@/app/lib/mongoDB";
import Company from "@/models/Company";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await DBConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Бүх талбар шаардлагатай" },
        { status: 400 }
      );
    }
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return NextResponse.json(
        { error: "Та бүртгэлтэй байна. Нэвтэрч орно уу!" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: company._id, email: company.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    const response = NextResponse.json({
      message: "Хэрэглэгч амжилттай үүслээ",
      userId: company._id,
    });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Алдаа гарлаа" },
      { status: 500 }
    );
  }
}