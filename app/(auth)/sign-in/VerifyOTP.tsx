import { useState } from "react";
import { useRouter } from "next/navigation";

const VerifyOTP = ({ confirmationResult, phone }: any) => {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!confirmationResult) {
      setError("No OTP request found. Please start again.");
      setLoading(false);
      return;
    }

    try {
      await confirmationResult.confirm(otp);
      router.push("/");
    } catch (error) {
      setError("Invalid OTP. Please try again.");
      console.error("Error during confirmationResult.confirm", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[rgba(0,0,0,0.9)] flex items-center justify-center min-h-screen">
      <div className="bg-[rgba(0,0,0,0.7)] rounded-lg shadow-md p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white text-center">
          Verify Your Phone Number
        </h1>
        <p className="text-white text-center text-sm mt-2">
          We&apos;ve sent a one-time passcode (OTP) to <b>{phone}</b>. Enter it below
          to log in or create your account.
        </p>

        <div className="mt-6">
          <label htmlFor="otp" className="block text-sm font-medium text-white">
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
          onClick={verifyOtp}
          className={`mt-6 w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition ${
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

export default VerifyOTP;
