import React, { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../../firebase";
import { signInWithPhoneNumber } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier?: any;
    confirmationResult?: any;
  }
}

const OtpPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);

    const confirmationResult = window.confirmationResult;

    if (!confirmationResult) {
      setError("No OTP request found. Please start again.");
      setLoading(false);
      return;
    }

    try {
      await confirmationResult.confirm(otp);
      router.push("/dashboard"); // Redirect to dashboard or next page
    } catch (err) {
      console.error(err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Verify Your Phone Number
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Enter the OTP sent to your phone number.
        </p>

        <div className="mt-6">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter your OTP here"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleVerifyOtp}
          className={`mt-6 w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify and Continue"}
        </button>
      </div>
    </div>
  );
};

export default OtpPage;
