"use server";

import { db } from "@/app/firebase";
import {
  verifyAuthenticationResponse,
  generateAuthenticationOptions,
} from "@simplewebauthn/server";
import { collection, getDocs, query, where } from "firebase/firestore";

const generateAuthenticationOptionsStep = async (usersCredentials: any) => {
  const loginOptionsParameters: any = {
    timeout: 60000,
    allowCredentials: [
      // TODO: return array of usersCredentials if for multiple passkeys
      {
        id: new Uint8Array(Buffer.from(usersCredentials.externalID, "base64")),
        type: "public-key",
      },
    ],
    userVerification: "required",
    rpID: process.env.RPID ?? "localhost",
  };
  const authenticationOptionsJSON = await generateAuthenticationOptions(
    loginOptionsParameters
  );
  return authenticationOptionsJSON;
};

export const verifyAuthenticationStep = async (
  userCredential: any,
  challenge: string,
  authenticationResponse: any
) => {
  let verification: any;

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

  try {
    const opts = {
      response: authenticationResponse,
      expectedChallenge: challenge,
      expectedOrigin: process.env.VERCEL_URL ?? "http://localhost:3000",
      expectedRPID: process.env.RPID ?? "localhost",
      authenticator: dbAuthenticator,
      requireUserVerification: true,
    };
    verification = await verifyAuthenticationResponse(opts);
  } catch (err) {
    const verifyAuthenticationError = err as Error;
    throw new Error(verifyAuthenticationError.message);
  }

  const { verified, authenticationInfo } = verification;

  if (verified) {
    //Firebase update updateCredentialSignCount
    // updateCredentialSignCount(
    //   userCredential.externalID,
    //   authenticationInfo.newCounter
    // );
  }

  return verification;
};

export const getAuthenticationOptionsJSON = async (phone: string) => {
  const querySnapshot: any = await getDocs(
    query(collection(db, "users"), where("phone", "==", phone))
  );

  if (!querySnapshot.empty) {
    const data = querySnapshot.docs[0].data();
    const authenticationOptionsJSON = await generateAuthenticationOptionsStep(
      data
    );
    return authenticationOptionsJSON;
  } else {
    return null;
  }
};
