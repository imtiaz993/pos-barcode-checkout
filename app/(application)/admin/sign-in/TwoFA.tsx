import { db } from "@/utils/firebase";
import axios from "axios";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const TwoFA = ({ hanldeLogin, values }: any) => {
  const [otp, setOtp] = useState("");
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [loading, setLoading] = useState(true);

  const [is2FaRegistered, setIs2FaRegistered] = useState(false);
  const [qrImage, setQrImage] = useState();
  const [secret, setSecret] = useState();

  /* Generate a QR */
  const get2faQrCode = async () => {
    const response = await axios.get(`/api/2fa/qrcode`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status == 200) {
      setQrImage(response.data.data);
      setSecret(response.data.secret);
      const userData = {
        email: values.email,
        secret: response.data.secret,
      };

      await setDoc(doc(db, "admin-twoFA", values.email), userData, {
        merge: true,
      });
    }
  };

  useEffect(() => {
    const handle2fa = async () => {
      const querySnapshot: any = await getDocs(
        query(collection(db, "admin-twoFA"), where("email", "==", values.email))
      );

      setLoading(false);
      if (!querySnapshot.empty) {
        setIs2FaRegistered(true);
        const userData = querySnapshot.docs[0].data();
        setSecret(userData.secret);
      } else {
        get2faQrCode();
      }
    };
    handle2fa();
  }, []);

  /* Validate Code  */
  const handleOtpChange = async (e: any) => {
    setOtp(e.target.value);
    setInvalidOtp(false);

    if (e.target.value.length === 6) {
      const token = e.target.value;
      const response = await axios.post(
        `/api/2fa/verify`,
        { secret, token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.verified) {
        hanldeLogin(values);
      } else {
        setInvalidOtp(true);
      }
    }
  };

  return (
    !loading && (
      <div className="rounded-lg shadow-sm border p-6 pt-0 w-full max-w-md mx-auto">
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
        <p className="text-xl font-bold text-center">
          {is2FaRegistered
            ? "Two-Factor Authentication"
            : "Use an Authenticator App to enable 2FA"}
        </p>
        <div>
          <div className="flex flex-1 justify-center items-center py-4 rounded-md">
            {qrImage && (
              <img
                src={qrImage}
                alt="2FA QR Code"
                className="rounded-lg border-2"
              />
            )}
          </div>

          <div className="flex-1 py-4 rounded-md">
            {is2FaRegistered ? (
              <ul className="list-none list-inside mb-4 text-sm text-gray-700">
                <li className="mb-2">
                  Enter the six-digit code from your authentication app
                </li>
              </ul>
            ) : (
              <ul className="list-none list-inside mb-4 text-sm text-gray-700">
                <li className="mb-2">
                  <span className="font-bold">Step 1:</span> Scan the QR Code
                  with your Authenticator app.
                </li>
                <li className="mb-2">
                  <span className="font-bold">Step 2:</span> Enter the code
                  below from your app.
                </li>
              </ul>
            )}

            {/* OTP Input */}
            <label
              htmlFor="password"
              className="block text-sm font-medium mt-4"
            >
              OTP
            </label>
            <div className="mt-2">
              <input
                type="text"
                maxLength={6}
                value={otp}
                className={`block w-full px-3 py-2 border border-gray-300
           rounded-lg shadow-sm text-sm focus:outline-none`}
                onChange={handleOtpChange}
              />
            </div>

            {/* Invalid Input */}
            {
              <p className="mt-3 text-red-500 text-sm">
                {invalidOtp && "Incorrect OTP. Please try again."}
              </p>
            }
          </div>
        </div>
      </div>
    )
  );
};

export default TwoFA;
