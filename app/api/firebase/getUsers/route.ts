import { NextResponse } from "next/server";
import admin from "@/utils/firebaseAdmin";

export async function GET() {
  try {
    const auth = admin.auth();

    const listUsers = await auth.listUsers();

    const phoneAuthUsers = listUsers.users.filter((user) => {
      return user.providerData.some(
        (provider) => provider.providerId === "phone"
      );
    });

    return NextResponse.json({ users: phoneAuthUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
