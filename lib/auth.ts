const auth0 = require("auth0-js");

export const auth = new auth0.WebAuth({
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  responseType: "token id_token",
  redirectUri: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
  scope: "openid profile phone",
});

export const logout = (redirect: string) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("idToken");
  localStorage.removeItem("idTokenPayload");
  auth.logout({ returnTo: redirect });
};

export const handleAuth = () => {
  return new Promise((resolve, reject) => {
    auth.parseHash((err: any, authResult: any) => {
      if (err) return reject(err);
      if (!authResult || !authResult.idToken) return reject("No Auth Result");

      localStorage.setItem("access_token", authResult.accessToken);
      localStorage.setItem("id_token", authResult.idToken);
      resolve(authResult);
    });
  });
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
