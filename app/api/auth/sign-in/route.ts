import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import DBConnect from "@/app/lib/mongoDB";
import Company from "@/models/Company";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export async function POST(req: Request) {
  await DBConnect();

  const { email, password } = await req.json();
  const company = await Company.findOne({ email }).select("+password");

  if (!company)
    return NextResponse.json(
      { error: "Нууц үг эсвэл э-майл буруу байна" },
      { status: 401 }
    );

  const isValid = await bcrypt.compare(password, company.password);
  if (!isValid)
    return NextResponse.json(
      { error: "Нууц үг буруу байна" },
      { status: 401 }
    );

  // 1️⃣ Access token (богино хугацаатай)
  const token = jwt.sign(
    { id: company._id, email: company.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // 2️⃣ Refresh token (урт хугацаатай, httpOnly cookie-д)
  const refreshToken = jwt.sign(
    { id: company._id, email: company.email },
    REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  const response = NextResponse.json({
    message: "Амжилттай нэвтэрлээ",
    company: {
      id: company._id,
      email: company.email,
      name: company.name,
    },
  });

  // 3️⃣ Cookies set хийх
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1h
  });

  response.cookies.set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 өдөр
  });

  return response;
}
