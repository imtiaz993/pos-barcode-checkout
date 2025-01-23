import { NextResponse } from "next/server";
import admin from "../../../utils/firebaseAdmin";

export async function POST(request) {
  try {
    const { uid } = await request.json(); // Receive UID from the request body

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Assign the admin role
    await admin.auth().setCustomUserClaims(uid, { admin: true });

    return NextResponse.json({
      message: `User with UID ${uid} is now an admin.`,
    });
  } catch (error) {
    console.error("Error setting admin role:", error);
    return NextResponse.json(
      { error: "Failed to set admin role." },
      { status: 500 }
    );
  }
}
