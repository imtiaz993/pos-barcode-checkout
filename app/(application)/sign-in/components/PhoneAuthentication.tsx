import { useState } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import * as Yup from "yup";

import "react-phone-input-2/lib/style.css";
import { auth } from "@/lib/auth";

const PhoneAuthentication = ({ setPhone, phone_number, setStep }: any) => {
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      setPhone(values.phone);

      try {
        // Initiate the SMS passwordless flow by sending an OTP to the phone number.
        auth.passwordlessStart(
          {
            connection: "sms", // Ensure this matches your SMS passwordless connection name in Auth0
            send: "code", // Use 'code' to send an OTP (one-time code)
            phoneNumber: values.phone, // Phone number in E.164 format (e.g., "+15551234567")
          },
          (err: any, res: any) => {
            if (err) {
              console.error("Error sending OTP:", err);
              formik.setFieldError("phone", err.description || err.message);
              return;
            }
            setStep("otp");
          }
        );
      } catch (error: any) {
        console.log("Error during signInWithPhoneNumber", error);
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
