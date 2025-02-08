"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PhoneAuthentication from "./components/PhoneAuthentication";
import VerifyOTP from "./components/VerifyOTP";
import { getUserData, getUserToken } from "@/lib/auth";

const PhoneAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");
  const gift_card = searchParams.get("gift_card");
  const phone_number = searchParams.get("phone_number");

  const user = getUserData();
  const isLoggedIn = getUserToken();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const handleAuth = async () => {
      if (user && isLoggedIn) {
        //TODO: change admin as per Auth0
        if (user?.claims?.admin) {
          router.replace("/admin/order-history");
        } else {
          if (type == "/activate-gift-card") {
            router.replace(
              `${type}?gift_card=${gift_card}&phone_number=${phone_number}`
            );
          } else {
            router.replace(
              `${type != "null" ? +"/" : ""}/${region}/${storeId}`
            );
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
    <div className="max-w-md mx-auto">
      {step === "phone" ? (
        <PhoneAuthentication
          setPhone={setPhone}
          phone_number={phone_number}
          setStep={setStep}
        />
      ) : (
        <VerifyOTP phone={phone} />
      )}
    </div>
  );
};

export default PhoneAuth;
