import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { binaryToBase64url, clean } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { credential, challenge } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { error: "No credential provided" },
        { status: 400 }
      );
    }

    const verification: any = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challenge,
      requireUserVerification: true,
      expectedOrigin: process.env.VERCEL_APP_URL || "", // or your actual origin
      expectedRPID: process.env.RPID, // e.g. "yourdomain.com"
    });

    if (!verification.verified) {
      return NextResponse.json(
        { error: "Registration verification failed" },
        { status: 400 }
      );
    }

    const credentialID = await clean(
      await binaryToBase64url(verification.registrationInfo.credentialID)
    );

    const credentialPublicKey = Buffer.from(
      verification.registrationInfo.credentialPublicKey
    ).toString("base64");

    return NextResponse.json(
      { credentialID, credentialPublicKey },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error verifying registration:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
