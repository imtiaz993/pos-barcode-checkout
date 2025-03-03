import QRCode from "qrcode";
import speakeasy from "speakeasy";

export async function GET() {

    const secret = speakeasy.generateSecret({
        name: "Eco Boutique",
    });

    const data = await QRCode.toDataURL(secret.otpauth_url!);

    return Response.json({ data, secret: secret.base32, status: 200 });
}