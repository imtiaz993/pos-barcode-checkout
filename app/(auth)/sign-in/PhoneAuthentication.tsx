import { useState } from "react";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { app } from "../../firebase";

const PhoneAuthentication = ({
  setConfirmationResult,
  phone,
  setPhone,
}: any) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  const sendOtp = async (e: any) => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = getAuth(app);
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaVerifier
      );
      setConfirmationResult(confirmation);
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
      console.error("Error during signInWithPhoneNumber", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[rgba(0,0,0,0.9)] flex items-center justify-center min-h-dvh">
      <div className="bg-[rgba(0,0,0,0.7)] rounded-lg shadow-md p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white text-center">
          Welcome! Let&apos;s Get Started
        </h1>
        <p className="text-white text-sm text-center mt-2">
          Enter your phone number to sign in or create an account.
        </p>

        <div className="mt-6">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-white"
          >
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={sendOtp}
          className={`mt-6 w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Continue"}
        </button>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuthentication;
