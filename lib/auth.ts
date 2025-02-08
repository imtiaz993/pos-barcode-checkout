const auth0 = require("auth0-js");

export const auth = new auth0.WebAuth({
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  responseType: "token id_token",
  redirectUri: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
  scope: "openid profile phone",
});

export const getManagementApiToken = async () => {
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
};

export const handleAuth = () => {
  return new Promise((resolve, reject) => {
    auth.parseHash((err: any, authResult: any) => {
      if (err) return reject(err);
      if (!authResult || !authResult.idToken) return reject("No Auth Result");

      localStorage.setItem("accessToken", authResult.accessToken);
      localStorage.setItem("idToken", authResult.idToken);
      localStorage.setItem(
        "idTokenPayload",
        JSON.stringify(authResult.idTokenPayload)
      );
      resolve(authResult);
    });
  });
};

export const logout = (redirect: string) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("idToken");
  localStorage.removeItem("idTokenPayload");
  auth.logout({ returnTo: redirect });
};

export const getUserData = () => {
  let userData = null;
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("idTokenPayload");
    if (data) {
      userData = JSON.parse(data);
    }
  }
  return userData;
};

export const updateUserData = (userData: any) => {
  localStorage.setItem("idTokenPayload", JSON.stringify(userData));
};

export const getUserToken = () => {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("accessToken");
  }
  return token;
};

const getUserTokenAccess = () => {
  return new Promise((resolve, reject) => {
    auth.checkSession(
      {
        audience: "https://api.ecoboutiquemarket.com/auth0",
        scope:
          "read:users update:users read:users_app_metadata update:users_app_metadata create:users_app_metadata",
      },
      (err: any, authResult: any) => {
        if (err) return reject(err);
        resolve(authResult.accessToken);
      }
    );
  });
};
