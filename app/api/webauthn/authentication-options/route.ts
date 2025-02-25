import { NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Missing 'phone' in request body" },
        { status: 400 }
      );
    }

    const querySnapshot = await getDocs(
      query(collection(db, "users-passkey"), where("phone", "==", phone))
    );

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = querySnapshot.docs[0].data();

    const loginOptionsParameters: any = {
      timeout: 60000,
      allowCredentials: [
        {
          id: new Uint8Array(Buffer.from(userData.externalID, "base64")),
          type: "public-key",
        },
      ],
      userVerification: "required",
      rpID: process.env.RPID,
    };

    const authenticationOptionsJSON = await generateAuthenticationOptions(
      loginOptionsParameters
    );

    return NextResponse.json({
      authenticationOptions: authenticationOptionsJSON,
    });
  } catch (error) {
    console.log("Error generating authentication options:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
