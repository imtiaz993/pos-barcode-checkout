import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { generateChallenge } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    const challenge = await generateChallenge();

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
      supportedAlgorithmIDs: [-7, -257],
    };

    const registrationOptions = await generateRegistrationOptions(
      registrationOptionsParameters
    );

    return NextResponse.json(registrationOptions, { status: 200 });
  } catch (error) {
    console.error("Error generating registration options:", error);
    return NextResponse.json(
      { error: "Failed to generate registration options" },
      { status: 500 }
    );
  }
}
