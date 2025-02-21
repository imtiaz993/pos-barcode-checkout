import { NextResponse } from "next/server";
import admin from "@/utils/firebaseAdmin";

export async function GET() {
  try {
    const auth = admin.auth();

    const listUsers = await auth.listUsers();

    const users = listUsers.users.filter((user: any) => {
      return user?.customClaims?.manager == true;
    });

    return NextResponse.json({ managers: users });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch managers" },
      { status: 500 }
    );
  }
}
