import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { app, db } from "@/app/firebase";
import { supported } from "@github/webauthn-json";
import { startRegistration } from "@simplewebauthn/browser";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import axios from "axios";
import Footer from "@/components/Footer";

const VerifyOTP = ({ confirmationResult, phone, recaptchaVerifier }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");
  const gift_card = searchParams.get("gift_card");
  const phone_number = searchParams.get("phone_number");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [passKeySaved, setPassKeySaved] = useState<boolean | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [resendOtpEnabled, setResendOtpEnabled] = useState(false);
  const [timer, setTimer] = useState(59);

  const getPasskeyInfo = async () => {
    const querySnapshot: any = await getDocs(
      query(collection(db, "users-passkey"), where("phone", "==", phone))
    );
    if (!querySnapshot.empty) {
      setPassKeySaved(true);
    } else {
      setPassKeySaved(false);
    }
  };

  useEffect(() => {
    const checkAvailability = async () => {
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setIsAvailable(available && supported());
    };
    checkAvailability();
    getPasskeyInfo();
  }, []);

  useEffect(() => {
    const savedTime = localStorage.getItem("otpResendTime");
    const now = Math.floor(Date.now() / 1000);

    if (savedTime && now < parseInt(savedTime, 10)) {
      const remainingTime = parseInt(savedTime, 10) - now;
      setTimer(remainingTime);
      setResendOtpEnabled(false);
    } else {
      setResendOtpEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!resendOtpEnabled) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(interval);
            setResendOtpEnabled(true);
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [resendOtpEnabled]);

  useEffect(() => {
    if (timer > 0) {
      const expiryTime = Math.floor(Date.now() / 1000) + timer;
      localStorage.setItem("otpResendTime", expiryTime.toString());
    } else {
      localStorage.removeItem("otpResendTime");
    }
  }, [timer]);

  const resendOtp = async () => {
    setResendOtpEnabled(false);
    setTimer(59);

    setError("");
    setLoading(true);
    try {
      const auth = getAuth(app);
      await signInWithPhoneNumber(auth, phone, recaptchaVerifier.current);
    } catch (error: any) {
      const firebaseError = error.message || "UNKNOWN_ERROR";

      switch (firebaseError) {
        case "USER_DISABLED":
          setError("Your account has been disabled. Please contact support.");
          break;
        case "INVALID_PHONE_NUMBER":
        case "auth/invalid-phone-number":
          setError("Invalid phone number. Please enter a valid one.");
          break;
        case "QUOTA_EXCEEDED":
        case "auth/quota-exceeded":
          setError("Too many requests. Please try again later.");
          break;
        case "TOO_MANY_ATTEMPTS_TRY_LATER":
        case "auth/too-many-requests":
          setError("Too many attempts. Please wait before trying again.");
          break;
        case "OPERATION_NOT_ALLOWED":
        case "auth/operation-not-allowed":
          setError("Phone sign-in is not enabled. Please contact support.");
          break;
        default:
          // Fallback for other unknown error codes
          setError("Failed to send OTP. Please try again.");
      }
      console.error("Error during signInWithPhoneNumber", error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .required("OTP is required")
        .matches(/^\d{6}$/, "OTP must be a 6-digit number"),
    }),
    onSubmit: async (values) => {
      setError("");
      setLoading(true);

      if (!confirmationResult) {
        setError("No OTP request found. Please start again.");
        setLoading(false);
        return;
      }

      try {
        await confirmationResult.confirm(values.otp);
        if (!passKeySaved && isAvailable) {
          try {
            const { data: registrationOptions } = await axios.post(
              "/api/webauthn/registration-options",
              {
                phone,
              }
            );

            const registrationResponse = await startRegistration(
              registrationOptions
            );

            const { data: verifyResponse } = await axios.post(
              "/api/webauthn/verify-registration",
              {
                credential: registrationResponse,
                challenge: registrationOptions.challenge,
              }
            );
            const userData = {
              phone: phone,
              externalID: verifyResponse.credentialID,
              publicKey: verifyResponse.credentialPublicKey,
            };

            await setDoc(doc(db, "users-passkey", phone), userData, {
              merge: true,
            });
          } catch (error) {
            console.log(error);
          }
        }
        if (type == "/activate-gift-card") {
          router.replace(
            `${type}?gift_card=${gift_card}&phone_number=${phone_number}`
          );
        } else {
          router.replace(`${type != "null" ? +"/" : ""}${region}/${storeId}`);
        }
      } catch (error) {
        setLoading(false);
        setError("Invalid OTP. Please try again.");
        console.log("Error during confirmationResult.confirm", error);
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-between min-h-dvh">
      <div></div>
      <div className="rounded-lg shadow-sm border p-6 pt-0 w-full mx-auto max-w-md">
        <div className="flex justify-center">
          <Image
            priority={true}
            src="/images/logo.png"
            width={0}
            height={0}
            sizes="100vw"
            alt=""
            className="w-auto"
          />
        </div>
        <h1 className="text-2xl font-bold text-center">
          Verify Your Phone Number
        </h1>
        <p className="text-[#71717a] text-center text-sm mt-2">
          We&apos;ve sent a one-time passcode (OTP) to <b>{phone}</b>. Enter it
          below to log in or create your account.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-6">
          <label htmlFor="otp" className="block text-sm font-medium">
            OTP
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your OTP here"
            className={`mt-2 block w-full px-2 py-2 text-sm border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              formik.touched.otp && formik.errors.otp
                ? "border-red-500"
                : "border-gray-300"
            } text-gray-700`}
          />
          {formik.touched.otp && formik.errors.otp && (
            <p className="text-red-500 text-sm mt-2">{formik.errors.otp}</p>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className={`mt-6 w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify and Continue"}
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <button
            onClick={resendOtp}
            type="button"
            className={`text-blue-600 text-sm hover:underline ${
              !resendOtpEnabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={!resendOtpEnabled}
          >
            Resend OTP{" "}
            {resendOtpEnabled ? "" : `in 0:${timer < 10 ? "0" : ""}${timer}`}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyOTP;
