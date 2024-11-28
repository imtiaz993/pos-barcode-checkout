"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const OtpPage = () => {
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const router = useRouter();

  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  const handleVerifyOtp = async (values:any) => {
    setLoading(true);
    try {
      // Mock API call for OTP verification
      const response = await axios.post("/api/verify-otp", { otp: values.otp });
      console.log(response.data); // Log response for debugging
      router.push("/dashboard"); // Navigate to dashboard or next page
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendMessage("Sending...");
      // Mock API call for resending OTP
      await axios.post("/api/resend-otp");
      setResendMessage("OTP has been resent successfully!");
    } catch (error) {
      console.error("Error resending OTP:", error);
      setResendMessage("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Verify Your Phone Number</h1>
        <p className="text-gray-600 text-center mt-2">
          We've sent a one-time passcode (OTP) to +1 (XXX) XXX-XXXX. Enter it below to log in or create your account.
        </p>

        <Formik
          initialValues={{ otp: "" }}
          validationSchema={otpValidationSchema}
          onSubmit={handleVerifyOtp}
        >
          {({ isSubmitting }) => (
            <Form className="mt-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  OTP
                </label>
                <Field
                  name="otp"
                  type="text"
                  placeholder="Enter your OTP here"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className={`mt-6 w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition ${
                  isSubmitting || loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting || loading}
              >
                {loading ? "Verifying..." : "Verify and Continue"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-gray-600 text-center mt-4 text-sm">
          Didn't receive a code?{" "}
          <button
            onClick={handleResendOtp}
            className="text-blue-500 font-medium hover:underline focus:outline-none"
          >
            Resend OTP
          </button>
        </p>
        {resendMessage && (
          <p className="text-center mt-2 text-sm text-green-500">{resendMessage}</p>
        )}
      </div>
    </div>
  );
};

export default OtpPage;
