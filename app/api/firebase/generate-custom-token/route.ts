import { NextResponse } from "next/server";
import admin from "@/utils/firebaseAdmin";

export async function POST(request: any) {
  try {
    const { phone } = await request.json(); // Receive UID from the request body

    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    const auth = admin.auth();

    const listUsers = await auth.listUsers();

    // Filter users who are authenticated by password
    const user: any = listUsers.users.find((user) => {
      return user.phoneNumber == phone;
    });

    // Generate custom token
    const firebaseToken = await auth.createCustomToken(user.uid);

    return NextResponse.json({
      firebaseToken,
    });
  } catch (error) {
    console.error("Error setting admin role:", error);
    return NextResponse.json(
      { error: "Failed to set admin role." },
      { status: 500 }
    );
  }
}
