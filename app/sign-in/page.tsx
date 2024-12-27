"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkAuthState } from "../../utils/firebaseAuth";
import PhoneAuthentication from "./components/PhoneAuthentication";
import VerifyOTP from "./components/VerifyOTP";

const PhoneAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");
  const gift_card = searchParams.get("gift_card");

  let recaptchaVerifier = useRef<any>();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const handleAuth = async () => {
      const isLoggedIn = await checkAuthState();
      if (isLoggedIn) {
        if (type == "/activate-gift-card") {
          router.replace(`${type}?gift_card=${gift_card}`);
        } else {
          router.replace(`${type}/${region}/${storeId}`);
        }
        return;
      }
      setCheckingAuth(false);
    };

    handleAuth();
  }, []);

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
