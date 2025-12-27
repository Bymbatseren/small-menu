import { NextResponse } from "next/server";
import DBConnect from "@/app/lib/mongoDB";
import Company from "@/models/Company";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    await DBConnect();
    const { tableCode, items, total } = await req.json();

    if (!tableCode || !items || !total) {
      return NextResponse.json({ error: "Мэдээлэл дутуу байна" }, { status: 400 });
    }
    const company = await Company.findOne({ "tables.tableCode": tableCode });
    if (!company) {
      return NextResponse.json({ error: "Company олдсонгүй" }, { status: 404 });
    }
    const order = await Order.create({
      company: company._id,
      tableCode,
      items,
      total,
      status: "PENDING",
    });
    try {
      const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      await fetch(`${apiUrl}/api/socket/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "new-order",
          data: order,
        }),
      });
    } catch (error) {
      console.error("Socket notification failed:", error);

    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

