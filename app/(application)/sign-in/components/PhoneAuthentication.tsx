import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import * as Yup from "yup";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithCustomToken,
} from "firebase/auth";
import { app, db } from "@/app/firebase";
import { supported } from "@github/webauthn-json";
import { startAuthentication } from "@simplewebauthn/browser";

import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";
import { collection, getDocs, query, where } from "firebase/firestore";
import axios from "axios";

const PhoneAuthentication = ({
  setConfirmationResult,
  setPhone,
  recaptchaVerifier,
  phone_number,
}: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");
  const gift_card = searchParams.get("gift_card");

  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    if (typeof window !== "undefined") {
      recaptchaVerifier.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  }, [auth, recaptchaVerifier]);

  const loginUserWithCustomToken = async (phone: any) => {
    try {
      const data: any = await axios.post(
        "/api/firebase/generate-custom-token",
        {
          phone: phone,
        }
      );

      if (data) {
        signInWithCustomToken(auth, data.data.firebaseToken)
          .then(() => {
            if (type == "/activate-gift-card") {
              router.replace(
                `${type}?gift_card=${gift_card}&phone_number=${phone_number}`
              );
            } else {
              router.replace(
                `${type != "null" ? +"/" : ""}${region}/${storeId}`
              );
            }
          })
          .catch((error: any) => {
            console.error("Login error:", error.message);
          });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const checkAvailability = async () => {
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setIsAvailable(available && supported());
    };
    checkAvailability();
  }, []);

  const formik: any = useFormik({
    initialValues: {
      phone: phone_number ? "+" + phone_number.replace(" ", "") : "",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required("Phone number is required")
        .matches(
          /^\+?[1-9]\d{1,14}$/,
          "Phone number must be in international format (e.g., +1234567890)"
        ),
    }),
    onSubmit: async (values) => {
      setPhone(values.phone);

      setLoading(true);
      try {
        const querySnapshot: any = await getDocs(
          query(collection(db, "users"), where("phone", "==", values.phone))
        );
        if (!querySnapshot.empty) {
          const userCredential = querySnapshot.docs[0].data();

          const { data } = await axios.post(
            "/api/webauthn/authentication-options",
            {
              phone: values.phone,
            }
          );

          const { challenge }: any = data.authenticationOptions;

          const authenticationResponse = await startAuthentication(
            data.authenticationOptions
          );

          const { data: verification } = await axios.post(
            "/api/webauthn/verify-authentication",
            {
              userCredential,
              challenge,
              authenticationResponse,
            }
          );

          if (
            !verification.verification.verified ||
            values.phone !== userCredential.phone
          ) {
            throw new Error("Login verification failed");
          } else {
            loginUserWithCustomToken(values.phone);
          }
        } else {
          try {
            const confirmation = await signInWithPhoneNumber(
              auth,
              values.phone,
              recaptchaVerifier.current
            );
            setConfirmationResult(confirmation);
          } catch (error: any) {
            formik.setFieldError(
              "phone",
              "Failed to send OTP. Please try again."
            );
            console.log("Error during signInWithPhoneNumber", error);
          }
        }
      } catch (err) {
        const loginError = err as Error;
        console.log(loginError);
        toast.error(loginError.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-dvh">
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
        <h1 className="text-2xl font-bold  text-center">
          Welcome! Let&apos;s Get Started
        </h1>
        <p className="text-[#71717a] text-sm text-center mt-2">
          Enter your phone number to sign in or create an account.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-6">
          <label htmlFor="phone" className="block text-sm font-medium ">
            Phone Number
          </label>
          <div className="mt-2">
            <PhoneInput
              country={"us"}
              value={formik.values.phone}
              onChange={(phone: string) =>
                formik.setFieldValue("phone", `+${phone}`)
              }
              inputStyle={{
                width: "100%",
                borderRadius: "0.5rem",
                borderColor:
                  formik.touched.phone && formik.errors.phone
                    ? "red"
                    : "#d1d5db",
                padding: "0.5rem 3rem",
                fontSize: "0.875rem",
              }}
              dropdownStyle={{
                borderRadius: "0.5rem",
              }}
            />
          </div>
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm mt-2">{formik?.errors?.phone}</p>
          )}

          <button
            type="submit"
            className={`mt-6 w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhoneAuthentication;
