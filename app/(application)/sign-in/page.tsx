"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PhoneAuthentication from "./components/PhoneAuthentication";
import VerifyOTP from "./components/VerifyOTP";

const PhoneAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");
  const gift_card = searchParams.get("gift_card");
  const phone_number = searchParams.get("phone_number");

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");

  // useEffect(() => {
  //   const handleAuth = async () => {
  //     const isLoggedIn = await checkAuthState();
  //     if (user && isLoggedIn) {
  //       const token = await user.getIdTokenResult();
  //       if (token.claims.admin) {
  //         router.replace("/admin/order-history");
  //       } else {
  //         if (type == "/activate-gift-card") {
  //           router.replace(
  //             `${type}?gift_card=${gift_card}&phone_number=${phone_number}`
  //           );
  //         } else {
  //           router.replace(`${type}/${region}/${storeId}`);
  //         }
  //       }
  //       return;
  //     }
  //   };

  //   handleAuth();
  // }, [user]);

  const webAuthRef: any = useRef(null);

  useEffect(() => {
    // Dynamically require auth0-js so it only loads on the client side.
    // This avoids issues with Next.js server-side rendering.
    const Auth0 = require("auth0-js");
    webAuthRef.current = new Auth0.WebAuth({
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN, // e.g., "your-tenant.auth0.com"
      clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID, // Your Auth0 client ID
      responseType: "token id_token",
      redirectUri: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL, // Must match allowed callback URLs in Auth0
      scope: "openid profile phone", // Include phone in the scope if needed
    });
  }, []);

  return (
    <div className="max-w-md mx-auto">
      {step === "phone" ? (
        <PhoneAuthentication
          setPhone={setPhone}
          phone_number={phone_number}
          setStep={setStep}
          webAuthRef={webAuthRef}
        />
      ) : (
        <VerifyOTP phone={phone} webAuthRef={webAuthRef} />
      )}
    </div>
  );
};

export default PhoneAuth;
