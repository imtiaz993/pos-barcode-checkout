// pages/callback.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const Auth0 = require("auth0-js");
    const webAuth = new Auth0.WebAuth({
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
      clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
      responseType: "token id_token",
      redirectUri: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
      scope: "openid profile phone",
    });

    webAuth.parseHash((err, authResult) => {
      if (err) {
        console.error("Error parsing hash:", err);
        return;
      }
      if (authResult && authResult.accessToken && authResult.idToken) {
        // Optionally clear the URL hash
        window.location.hash = "";
        // Store tokens (for demonstration only—consider more secure storage in production)
        localStorage.setItem("accessToken", authResult.accessToken);
        localStorage.setItem("idToken", authResult.idToken);
        console.log("User successfully logged in!", authResult);
        // Redirect to the home page or another protected page
        router.push("/checkout/ca/s111");
      }
    });
  }, [router]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Processing Login...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
}
