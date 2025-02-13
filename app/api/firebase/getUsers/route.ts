import { NextResponse } from "next/server";
import admin from "@/utils/firebaseAdmin";

export async function GET() {
  try {
    const auth = admin.auth();

    // Fetch all users
    const listUsers = await auth.listUsers();

    // Filter users who are authenticated by phone
    const phoneAuthUsers = listUsers.users.filter((user) => {
      return user.providerData.some(
        (provider) => provider.providerId === "phone"
      );
    });

    return NextResponse.json({ users: phoneAuthUsers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
