// app/api/me/get-profile/route.ts
import { getManagementApiToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// 2) The PATCH request handler
export async function PATCH(req: NextRequest) {
  try {
    // a) Parse JSON body
    const body = await req.json();
    const { userId } = body;

    // b) Extract Bearer token from the Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Invalid Authorization header format" },
        { status: 401 }
      );
    }
    // d) Obtain the Management API token (server to server)
    const mgmtApiToken = await getManagementApiToken();

    // e) Send the PATCH request to Auth0 to update the user
    const patchRes = await fetch(
      `https://${
        process.env.NEXT_PUBLIC_AUTH0_DOMAIN
      }/api/v2/users/${encodeURIComponent(userId)}`,
      {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${mgmtApiToken}`,
        },
      }
    );

    if (!patchRes.ok) {
      const errorBody = await patchRes.json();
      console.error("Error from Auth0 Management API:", errorBody);
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 400 }
      );
    }

    const user = await patchRes.json();

    return NextResponse.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error: any) {
    console.error("Error in update-profile route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
