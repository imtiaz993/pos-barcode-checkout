// app/api/me/update-profile/route.ts
import { NextRequest, NextResponse } from "next/server";

// 1) Helper to get a Management API token
async function getManagementApiToken() {
  const res = await fetch(
    `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AUTH0_MGMT_CLIENT_ID,
        client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET,
        audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
        grant_type: "client_credentials",
      }),
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch Management API token", res);
    throw new Error("Could not get Management API token");
  }

  const data = await res.json();
  return data.access_token as string;
}

// 2) The PATCH request handler
export async function PATCH(req: NextRequest) {
  try {
    // a) Parse JSON body
    const body = await req.json();
    const { name, userId } = body;

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
