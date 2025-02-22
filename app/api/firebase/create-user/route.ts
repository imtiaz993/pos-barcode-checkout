import { NextResponse } from "next/server";
import admin from "@/utils/firebaseAdmin";

export async function POST(request: any) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email & Password is required" },
        { status: 400 }
      );
    }

    const data = await admin.auth().createUser({
      email,
      password,
    });

    return NextResponse.json({
      data: data,
      message: `User created.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
