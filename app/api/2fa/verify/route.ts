import { NextRequest } from "next/server";
import speakeasy from "speakeasy";

export async function POST(req: NextRequest) {
  const { secret, token } = await req.json();

  const verified = speakeasy.totp.verify({
    secret: secret, // Secret Key
    encoding: "base32",
    token: token, // OTP Code
  });

  return Response.json({ verified });
}
