import DBConnect from "@/app/lib/mongoDB";
import Company from "@/models/Company";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        await DBConnect();
        const { email } = await req.json()
        const company = await Company.findOne({ email })
        if (!company) {
            return NextResponse.json({ error: "Э-мэйл хаяг бүртгэлгүй байна" }, { status: 400 })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000)
        company.otp = otp
        company.otpExpires = otpExpires
        await company.save()
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        })
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Нууц үг сэргээх OTP код",
            text: `Таны OTP код: ${otp}. Энэ код 15 минутын дараа дуусна.`

        }
         await transporter.sendMail(mailOptions)
         return NextResponse.json({message:"OTP код амжилттай илгээлээ"})

    }catch(err){
       return NextResponse.json({err:"Нууц үг сэргээх явцад алдаа гарлаа"},{status:400})
    }
}