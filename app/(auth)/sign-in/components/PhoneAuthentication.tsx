import { useState } from "react";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { app } from "../../../firebase";

const PhoneAuthentication = ({ setConfirmationResult }: any) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = getAuth(app);
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
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
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Welcome! Let's Get Started
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Enter your phone number to sign in or create an account.
        </p>

        <div className="mt-6">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={sendOtp}
          className={`mt-6 w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Continue"}
        </button>
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default PhoneAuthentication;
