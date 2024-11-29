"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { app } from "../../firebase";
import { checkAuthState } from "../../../utils/firebaseAuth";
import VerifyOTP from "./VerifyOTP";
import PhoneAuthentication from "./PhoneAuthentication";

const PhoneAuth = () => {
  const router = useRouter();
  const recaptchaContainerRef = useRef(null);
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
      
    </div>
  );
};

export default PhoneAuth;
