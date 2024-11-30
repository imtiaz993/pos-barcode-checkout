import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { app } from "../../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";

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
    <div className="bg-[rgba(0,0,0,0.9)] flex items-center justify-center min-h-dvh">
      <div className="bg-[rgba(0,0,0,0.7)] rounded-lg shadow-md p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white text-center">
          Welcome! Let&apos;s Get Started
        </h1>
        <p className="text-white text-sm text-center mt-2">
          Enter your phone number to sign in or create an account.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-6">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-white"
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
            className={`mt-2 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
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
            className={`mt-6 w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition ${
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
