import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";

const VerifyOTP = ({ phone, webAuthRef }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");
  const gift_card = searchParams.get("gift_card");
  const phone_number = searchParams.get("phone_number");

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
    } catch (error: any) {
      console.log(error?.response?.data);
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

      try {
        const webAuth = webAuthRef.current;
        if (!webAuth) return;

        // Complete the passwordless login by verifying the OTP.
        // This call will redirect the browser to your callback URL with tokens in the URL hash.
        webAuth.passwordlessLogin(
          {
            connection: "sms",
            phoneNumber: phone,
            verificationCode: values.otp,
            responseType: "token id_token",
            redirectUri: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
            scope: "openid profile phone",
          },
          (err: any, authResult: any) => {
            if (err) {
              console.error("Error verifying OTP:", err);
              alert("Error verifying OTP: " + (err.description || err.message));
              return;
            }
            // In many cases this callback will not be reached because the browser
            // is redirected to the callback URL where tokens are processed.
            if (authResult && authResult.accessToken && authResult.idToken) {
              console.log("User logged in successfully", authResult);
            }
          }
        );
      } catch (error) {
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
        <h1 className="text-2xl font-bold text-center">
          Verify Your Phone Number
        </h1>
        <p className="text-[#71717a] text-center text-sm mt-2">
          We&apos;ve sent a one-time passcode (OTP) to <b>{phone}</b>. Enter it
          below to log in or create your account.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-6">
          <label htmlFor="otp" className="block text-sm font-medium">
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
            className={`mt-2 block w-full px-2 py-2 text-sm border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
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
            className={`mt-6 w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition ${
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
            className={`text-blue-600 text-sm hover:underline ${
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
