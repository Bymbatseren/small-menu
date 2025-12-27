import DBConnect from "@/app/lib/mongoDB";
import Company from "@/models/Company";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req:Request){
    try{
        await DBConnect()
        const {email,otp}=await req.json()
        const company=await Company.findOne({email})
        if(!company){
            return NextResponse.json({error:"Э-мэйл хаяг бүртгэлгүй байна"}, {status:400})
        }
         if(company.otp !== otp){
            return NextResponse.json({error:"OTP код буруу байна"}, {status:400})
    }
      if(company.otpExpires < new Date()){
        return NextResponse.json({error:"OTP код дууссан байна"}, {status:400})
    }
     const resetToken = jwt.sign({email},process.env.JWT_SECRET!,{expiresIn:"10m"})
       company.otp=undefined
    company.otpExpires=undefined
      await company.save()
       return NextResponse.json({message:"OTP амжилттай баталгаажлаа", resetToken})
    }
    catch(error){
        return NextResponse.json({error:"OTP баталгаажуулах явцад алдаа гарлаа:"}, {status:400})
    }
}