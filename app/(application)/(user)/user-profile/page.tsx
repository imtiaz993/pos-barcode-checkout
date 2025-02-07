"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import { useFormik } from "formik";
import * as Yup from "yup";

import "react-phone-input-2/lib/style.css";
import { getUserData, getUserToken, updateUserData } from "@/utils";
import Loader from "@/components/loader";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");

  const webAuthRef: any = useRef(null);
  const [userData, setUserData] = useState<any>();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const user = getUserData();
  const accessToken = getUserToken();

  const [giftCardBalance, setGiftCardBalance] = useState<any>();
  const [giftCardBalanceLoading, setGiftCardBalanceLoading] =
    useState<any>(true);

  useEffect(() => {
    axios
      .patch(
        "/api/me/get-profile",
        { userId: user?.sub },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res: any) => {
        setUserData(res.data.user);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error);
        console.error("Error fetching client secret:", error);
        setLoading(false);
      });

    axios
      .post("https://api.ecoboutiquemarket.com/giftcard/check-balance", {
        phone_number: user?.phone_number,
      })
      .then((res) => {
        setGiftCardBalance(res.data.balance);
        setGiftCardBalanceLoading(false);
      })
      .catch((error) => {
        setGiftCardBalance(0);
        setGiftCardBalanceLoading(false);
        toast.error(error?.response?.data?.message);
        console.error("Error fetching client secret:", error);
      });
  }, [accessToken]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(
        /^\+?[1-9]\d{1,14}$/,
        "Phone number must be in international format (e.g., +1234567890)"
      ),
  });

  const formik: any = useFormik({
    initialValues: {
      name: userData?.user_metadata?.name
        ? userData?.user_metadata?.name !== user.phone_number
          ? userData?.user_metadata?.name
          : ""
        : "",
      phone: user?.phone_number || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (!user) {
          return alert("No user is signed in!");
        }

        // Update name
        if (values.name !== userData?.user_metadata?.name) {
          const response = await fetch("/api/me/update-profile", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              name: values.name,
              userId: user?.sub,
            }),
          });
          if (response.ok) {
            updateUserData({ ...user, name: values.name });
          }
        }

        // Update phone
        if (values.phone !== user?.phone_number) {
          const verificationCode: any = window.prompt(
            "Enter the verification code:"
          );

          const response = await fetch("/api/me/update-profile", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              phone: values.phone,
              userId: user?.sub,
            }),
          });
          if (response.ok) {
            updateUserData({ ...user, phone_number: values.name });
          }

          // const credential = PhoneAuthProvider.credential(
          //   verificationId,
          //   verificationCode
          // );
        }
        toast.success("Profile updated successfully!");
      } catch (error: any) {
        console.error("Error updating profile:", error);
        toast.error("Error updating profile");
      }
    },
  });

  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("idToken");
      localStorage.removeItem("idTokenPayload");

      webAuthRef.current.logout({
        returnTo: `http://localhost:3000/sign-in?type=${type}&region=${region}&storeId=${storeId}`, // Where to redirect after logout
        clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
      });
    } catch (error) {
      alert("Failed to log out. Please try again.");
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const Auth0 = require("auth0-js");
    webAuthRef.current = new Auth0.WebAuth({
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
      clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    });
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-[calc(100dvh-41px-16px)] mx-auto px-4 py-2 ">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between mb-2">
            <p
              className="cursor-pointer text-blue-600"
              onClick={() => {
                router.back();
              }}
            >
              &larr; Back
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-blue-500 text-white py-2 px-3 text-sm rounded-lg hover:bg-blue-600 flex items-center"
            >
              <Image
                priority={true}
                src="/images/logout.svg"
                width={0}
                height={0}
                sizes="100vw"
                alt=""
                className="w-4 cursor-pointer mr-1"
              />
              Logout
            </button>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white">
              <div className="flex items-center">
                <h1 className="font-semibold my-4">
                  Gift Card Balance:{" "}
                  {giftCardBalanceLoading
                    ? "Loading..."
                    : `$${giftCardBalance}`}
                </h1>
                {!giftCardBalanceLoading && (
                  <p className="ml-3 text-blue-600 border-b border-b-blue-600 cursor-pointer text-sm">
                    <Link
                      href={`giftcard-history?type=${type}&region=${region}&storeId=${storeId}`}
                    >
                      View Transactions
                    </Link>
                  </p>
                )}
              </div>

              {/* View Order History Button */}
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/order-history?type=${type}&region=${region}&storeId=${storeId}`
                  )
                }
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-1.5 text-sm rounded-lg hover:bg-gray-200 mb-6"
              >
                View Order History
              </button>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className={`w-full px-2 py-2 text-sm border rounded-lg mb-2 ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Your name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="name"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-xs">{formik.errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <div className="mb-2">
                  <PhoneInput
                    country={"us"}
                    value={formik.values.phone}
                    onChange={(phone) => formik.setFieldValue("phone", phone)}
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
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-xs">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 text-sm rounded-lg hover:bg-blue-600"
              >
                Update Profile
              </button>
            </div>
          </form>
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </>
  );
}
