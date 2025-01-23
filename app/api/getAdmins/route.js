import { NextResponse } from "next/server";
import admin from "firebase-admin";

export async function GET() {
  try {
    const auth = admin.auth();

    // Fetch all users
    const listUsers = await auth.listUsers(); 

    // Filter users who are authenticated by password
    const phoneAuthUsers = listUsers.users.filter(user => {
      return user.providerData.some(provider => provider.providerId === 'password');
    });

    return NextResponse.json({ admins: phoneAuthUsers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}