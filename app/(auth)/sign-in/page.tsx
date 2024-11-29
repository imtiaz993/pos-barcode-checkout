"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { app } from "../../firebase";
import { checkAuthState } from "../../../utils/firebaseAuth";
import VerifyOTP from "./VerifyOTP";
import PhoneAuthentication from "./PhoneAuthentication";

const PhoneAuth = () => {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const handleAuth = async () => {
      const isLoggedIn = await checkAuthState();
      setCheckingAuth(false);
      if (isLoggedIn) {
        router.replace("/"); // Redirect to home if logged in
      }
    };

    handleAuth();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      const auth = getAuth(app);
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response: any) => {},
          "expired-callback": () => {
            window.recaptchaVerifier.reset();
          },
        }
      );
    }
  }, []);

  return checkingAuth ? (
    <></>
  ) : (
    <div>
      {!confirmationResult ? (
        <PhoneAuthentication
          setConfirmationResult={setConfirmationResult}
          phone={phone}
          setPhone={setPhone}
        />
      ) : (
        <VerifyOTP confirmationResult={confirmationResult} phone={phone} />
      )}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuth;
