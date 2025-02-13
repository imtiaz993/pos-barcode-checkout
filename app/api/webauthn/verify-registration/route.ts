import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { binaryToBase64url, clean } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // 1. Extract credential & challenge from the request body
    const { credential, challenge } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { error: "No credential provided" },
        { status: 400 }
      );
    }

    // 2. Ideally, retrieve the stored challenge from a DB or session:
    //    const storedChallenge = await db.session.find({ phone });
    //    Then compare with what's sent from the client. In this example,
    //    we trust `challenge` from the client, but that’s less secure.

    // 3. Verify the registration response
    const verification: any = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challenge,
      requireUserVerification: true,
      expectedOrigin: process.env.VERCEL_URL || "", // or your actual origin
      expectedRPID: process.env.RPID, // e.g. "yourdomain.com"
    });

    // 4. Check the verification result
    if (!verification.verified) {
      return NextResponse.json(
        { error: "Registration verification failed" },
        { status: 400 }
      );
    }

    // If successful, you may save the credential info to your DB here
    // e.g. db.userCredential.create({ data: { ... }});

    // 5. Return the verification result to the client
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
    console.error("Error verifying registration:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
