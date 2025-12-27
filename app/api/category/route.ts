// import DBConnect from "@/app/lib/mongoDB";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export async function GET(){
//   try{
//     await DBConnect();
//      const cookieStore =await cookies();
//         const token = cookieStore.get("token")?.value;
//         if (!token) {
//           return NextResponse.json(
//             { error: "Нэвтрээгүй байна" },
//             { status: 401 }
//           );
//         }
        

//   }
// }