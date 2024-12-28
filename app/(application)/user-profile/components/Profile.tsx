"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getAuth, updateProfile, updatePhoneNumber } from "firebase/auth";
import { PhoneAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { app } from "@/app/firebase";
import { logout } from "../../../../utils/firebaseAuth";
import axios from "axios";
import Link from "next/link";

const Profile = () => {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");

  const router = useRouter();
  const auth = getAuth(app);
  const user = auth.currentUser;
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
  });

  const [giftCardBalance, setGiftCardBalance] = useState<any>();
  const [giftCardBalanceLoading, setGiftCardBalanceLoading] =
    useState<any>(true);

  useEffect(() => {
    axios
      .post("https://api.ecoboutiquemarket.com/giftcard/check-balance", {
        phone_number: user?.phoneNumber,
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
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserData({
          name: user?.displayName ?? "",
          phone: user?.phoneNumber ?? "",
        });
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [auth]);
  let recaptchaVerifier = useRef<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      recaptchaVerifier.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  }, [auth]);

  // Update Profile
  const handleUpdateProfile = async () => {
    try {
      if (!user) return alert("No user is signed in!");

      const { name, phone } = userData;

      // Update name
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      // Update phone
      if (phone !== user.phoneNumber) {
        const phoneProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneProvider.verifyPhoneNumber(
          phone,
          recaptchaVerifier.current
        );
        const verificationCode: any = window.prompt(
          "Enter the verification code:"
        );
        const credential = PhoneAuthProvider.credential(
          verificationId,
          verificationCode
        );
        await updatePhoneNumber(user, credential);
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
      router.push(`/sign-in?type=${type}&region=${region}&storeId=${storeId}`);
    } catch (error) {
      alert("Failed to log out. Please try again.");
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="max-w-md">
      <div className="flex justify-between mb-2">
        <p
          className="cursor-pointer"
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
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white">
          <div className="flex items-center">
            <h1 className="font-semibold my-4">
              Gift Card Balance:{" "}
              {giftCardBalanceLoading ? "Loading..." : "$" + giftCardBalance}
            </h1>
            {!giftCardBalanceLoading && (
              <p className="ml-3 text-blue-600 border-b border-b-blue-600 cursor-pointer text-sm">
                <Link href={`giftcard-history?type=${type}&region=${region}&storeId=${storeId}`}>View Transactions</Link>
              </p>
            )}
          </div>
          {/* <div className="flex justify-between items-center my-4">
            <h2 className="text-xl font-bold ">Update Profile</h2>
          </div> */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
              placeholder="Your name"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
              placeholder="Your phone number"
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
            />
          </div>
          <button
            type="button"
            onClick={handleUpdateProfile}
            className="w-full bg-blue-500 text-white py-2 text-sm rounded-lg hover:bg-blue-600"
          >
            Update Profile
          </button>
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
