"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
      if (isLoggedIn) {
        router.replace("/");
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
