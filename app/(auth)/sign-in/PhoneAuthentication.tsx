import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { app } from "../../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";

const PhoneAuthentication = ({
  setConfirmationResult,
  setPhone,
  recaptchaVerifier,
}: any) => {
  const [loading, setLoading] = useState(false);
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
  }, [auth]);

  const formik = useFormik({
    initialValues: {
      phone: "",
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
        const confirmation = await signInWithPhoneNumber(
          auth,
          values.phone,
          recaptchaVerifier.current
        );
        setConfirmationResult(confirmation);
      } catch (error) {
        formik.setFieldError("phone", "Failed to send OTP. Please try again.");
        console.error("Error during signInWithPhoneNumber", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="rounded-lg shadow-sm border p-6 pt-0 w-full max-w-sm">
        <div className="flex justify-center">
          <Image
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
          <label
            htmlFor="phone"
            className="block text-sm font-medium "
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="+1234567890"
            className={`mt-2 block w-full px-2 py-2 text-sm border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              formik.touched.phone && formik.errors.phone
                ? "border-red-500"
                : "border-gray-300"
            } text-gray-700`}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm mt-2">{formik.errors.phone}</p>
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
