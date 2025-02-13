import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  generateRegistrationOptions,
} from "@simplewebauthn/server";
import { generateChallenge } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // 1. Extract any needed params from the request body
    const { phone } = await request.json();

    // 2. Generate the challenge
    const challenge = await generateChallenge();

    // 3. Build parameters for generateRegistrationOptions
    const registrationOptionsParameters: any = {
      challenge,
      rpName: "next-webauthn",
      rpID: process.env.RPID, // e.g., "yourdomain.com"
      userID: uuidv4(),
      userName: phone,
      userDisplayName: phone,
      timeout: 60000,
      attestationType: "none",
      authenticatorSelection: { residentKey: "discouraged" },
      supportedAlgorithmIDs: [-7, -257], // ES256, RS256
    };

    // 4. Generate the options
    const registrationOptions = await generateRegistrationOptions(
      registrationOptionsParameters
    );

    // 5. Optionally store the `challenge` in a DB or session to use during verification
    //    For now, we'll return it in the JSON (the client can pass it back later).
    //    But ideally, you'll store it in a session or database:
    //    await db.session.update({ phone }, { challenge });

    // 6. Return the registration options (including the challenge)
    return NextResponse.json(registrationOptions, { status: 200 });
  } catch (error) {
    console.error("Error generating registration options:", error);
    return NextResponse.json({ error: "Failed to generate registration options" }, { status: 500 });
  }
}
