import { NextResponse } from "next/server";
import admin from "@/utils/firebaseAdmin";

export async function GET() {
  try {
    const auth = admin.auth();

    const listUsers = await auth.listUsers();

    const phoneAuthUsers = listUsers.users.filter((user) => {
      return user.providerData.some(
        (provider) => provider.providerId === "password"
      );
    });

    return NextResponse.json({ admins: phoneAuthUsers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}
