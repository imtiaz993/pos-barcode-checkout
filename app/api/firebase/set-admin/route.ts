import { NextResponse } from "next/server";
import admin from "@/utils/firebaseAdmin";

export async function POST(request: any) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    await admin.auth().setCustomUserClaims(uid, { admin: true });

    return NextResponse.json({
      message: `User with UID ${uid} is now an admin.`,
    });
  } catch (error: any) {
    console.error("Error setting admin role:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
