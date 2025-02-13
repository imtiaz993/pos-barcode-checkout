"use server";

import { v4 as uuidv4 } from "uuid";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { generateChallenge } from "@/lib/auth";

export const getRegistrationOptions = async (phone: string) => {
  console.log("T1", process.env.RPID, uuidv4(), phone);
  const challenge: string = await generateChallenge();
  console.log("T2", challenge);

  const registrationOptionsParameters: any = {
    challenge,
    rpName: "next-webauthn",
    rpID: process.env.RPID,
    userID: uuidv4(),
    userName: phone,
    userDisplayName: phone,
    timeout: 60000,
    attestationType: "none",
    authenticatorSelection: { residentKey: "discouraged" },
    supportedAlgorithmIDs: [-7, -257], // the two most common algorithms: ES256, and RS256
  };

  const registrationOptions = await generateRegistrationOptions(
    registrationOptionsParameters
  );

  return registrationOptions;
};

export const verifyRegistration = async (
  credential: any,
  challenge: string
) => {
  let verification: any;
  if (credential == null) {
    throw new Error("Invalid Credentials");
  }

  try {
    verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challenge,
      requireUserVerification: true,
      expectedOrigin: process.env.VERCEL_URL || "",
      expectedRPID: process.env.RPID,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }

  if (!verification.verified) {
    throw new Error("Registration verification failed");
  }

  return verification;
};
