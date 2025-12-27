import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import DBConnect from "@/app/lib/mongoDB";
import Company from "@/models/Company";

export async function POST(req:Request){
    try{
        await DBConnect();
        const {token,newPassword} = await req.json()
        const decoded:any=jwt.verify(token,process.env.JWT_SECRET!);
        const company =await Company.findOne({email:decoded.email})
        if(!company){
            return NextResponse.json({error:"Хэрэглэгч олдсонгүй"}, {status:400})
        }

        const hashed=await bcrypt.hash(newPassword,10);
        company.password=hashed;
        await company.save();
        return NextResponse.json({message:"Нууц үг амжилттай шинэчлэгдлээ"})

    } catch(err){
        return NextResponse.json({error:"Нууц үг сэргээх явцад алдаа гарлаа:"}, {status:400})
    }
}