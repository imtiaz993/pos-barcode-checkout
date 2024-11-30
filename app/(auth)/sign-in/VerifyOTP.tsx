import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { app } from "../../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";

const VerifyOTP = ({ confirmationResult, phone, recaptchaVerifier }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("st");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendOtpEnabled, setResendOtpEnabled] = useState(false);
  const [timer, setTimer] = useState(59);

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
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
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
        router.push(`/?st=${storeId}`);
      } catch (error) {
        setError("Invalid OTP. Please try again.");
        console.error("Error during confirmationResult.confirm", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="bg-[rgba(0,0,0,0.9)] flex items-center justify-center min-h-dvh">
      <div className="bg-[rgba(0,0,0,0.7)] rounded-lg shadow-md p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white text-center">
          Verify Your Phone Number
        </h1>
        <p className="text-white text-center text-sm mt-2">
          We&apos;ve sent a one-time passcode (OTP) to <b>{phone}</b>. Enter it
          below to log in or create your account.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-6">
          <label htmlFor="otp" className="block text-sm font-medium text-white">
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
            className={`mt-2 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
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
            className={`mt-6 w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition ${
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
            className={`text-blue-500 hover:underline ${
              !resendOtpEnabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={!resendOtpEnabled}
          >
            Resend OTP{" "}
            {resendOtpEnabled ? "" : `in 0:${timer < 10 ? "0" : ""}${timer}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
