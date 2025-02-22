import { NextResponse } from "next/server";
import admin from "@/utils/firebaseAdmin";

export async function POST(request: any) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    const auth = admin.auth();

    const listUsers = await auth.listUsers();

    const user: any = listUsers.users.find((user) => {
      return user.phoneNumber == phone;
    });

    const firebaseToken = await auth.createCustomToken(user.uid);

    return NextResponse.json({
      firebaseToken,
    });
  } catch (error: any) {
    console.log("Error setting admin role:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
