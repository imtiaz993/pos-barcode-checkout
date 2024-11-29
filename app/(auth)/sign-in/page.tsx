"use client";

import { useState, useEffect } from "react";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { app } from "../../firebase";
import VerifyOTP from "./components/VerifyOTP";
import PhoneAuthentication from "./components/PhoneAuthentication";

const PhoneAuth = () => {
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

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

  return (
    <div>
      {!confirmationResult ? (
        <PhoneAuthentication setConfirmationResult={setConfirmationResult} />
      ) : (
        <VerifyOTP confirmationResult={confirmationResult} />
      )}
    </div>
  );
};

export default PhoneAuth;
