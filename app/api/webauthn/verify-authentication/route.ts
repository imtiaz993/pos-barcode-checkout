import { NextResponse } from "next/server";
import { db } from "@/app/firebase";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";

export async function POST(request: Request) {
  try {
    const { userCredential, challenge, authenticationResponse } =
      await request.json();

    if (!userCredential || !challenge || !authenticationResponse) {
      return NextResponse.json(
        {
          error: "Missing userCredential, challenge, or authenticationResponse",
        },
        { status: 400 }
      );
    }

    const dbAuthenticator = {
      credentialID: new Uint8Array(
        Buffer.from(userCredential.externalID, "base64")
      ),
      credentialPublicKey: new Uint8Array(
        Buffer.from(userCredential.publicKey, "base64")
      ),
      counter: userCredential.signCount,
    };

    if (!dbAuthenticator) {
      throw new Error("Authenticator is not registered with this site");
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: authenticationResponse,
        expectedChallenge: challenge,
        expectedOrigin: process.env.VERCEL_APP_URL || "",
        expectedRPID: process.env.RPID || "",
        authenticator: dbAuthenticator,
        requireUserVerification: true,
      });
    } catch (err: any) {
      console.error("Error verifying WebAuthn authentication:", err);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({ verification });
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
