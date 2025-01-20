"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkAuthState } from "@/utils/firebaseAuth";
import PhoneAuthentication from "./components/PhoneAuthentication";
import VerifyOTP from "./components/VerifyOTP";
import { getAuth } from "firebase/auth";
import { app } from "@/app/firebase";

const PhoneAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");
  const gift_card = searchParams.get("gift_card");

  const auth = getAuth(app);
  const user = auth.currentUser;

  let recaptchaVerifier = useRef<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const handleAuth = async () => {
      const isLoggedIn = await checkAuthState();
      if (user && isLoggedIn) {
        const token = await user.getIdTokenResult();
        if (token.claims.admin) {
          router.replace("/admin/order-history");
        } else {
          if (type == "/activate-gift-card") {
            router.replace(`${type}?gift_card=${gift_card}`);
          } else {
            router.replace(`${type}/${region}/${storeId}`);
          }
        }
        return;
      }
      setCheckingAuth(false);
    };

    handleAuth();
  }, [user]);

  if (checkingAuth) {
    return null;
  }

  return (
    <div>
      {!confirmationResult ? (
        <PhoneAuthentication
          setConfirmationResult={setConfirmationResult}
          setPhone={setPhone}
          recaptchaVerifier={recaptchaVerifier}
        />
      ) : (
        <VerifyOTP
          confirmationResult={confirmationResult}
          phone={phone}
          recaptchaVerifier={recaptchaVerifier}
        />
      )}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuth;
