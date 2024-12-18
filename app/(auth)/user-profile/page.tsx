"use client";
import { useState, useEffect, useRef } from "react";
import { getAuth, updateProfile, updatePhoneNumber } from "firebase/auth";
import { PhoneAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { app } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "../../../utils/firebaseAuth";
import Image from "next/image";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen mx-auto p-4 max-w-[540px]">
      {/* Tabs */}
      {/* <div className="flex justify-between border-b border-gray-300">
        <button
          className={`w-1/2 py-2 text-center ${
            activeTab === "profile"
              ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`w-1/2 py-2 text-center ${
            activeTab === "orders"
              ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Past Orders
        </button>
      </div> */}

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "profile" ? <ProfileTab /> : <OrdersTab />}
      </div>
    </div>
  );
}

function ProfileTab() {
  const router = useRouter();
  const auth = getAuth(app);
  const user = auth.currentUser;
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
  });

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
      router.push("/sign-in");
    } catch (error) {
      alert("Failed to log out. Please try again.");
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
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
      <div className="rounded-lg shadow-sm border p-6 pt-0 w-full max-w-sm mx-auto">
        <div className="bg-white">
          <div className="flex justify-between items-center my-4">
            <h2 className="text-xl font-bold ">Update Profile</h2>
            <button
              className="w-12 h-12 text-lg font-medium text-center"
              onClick={() => {
                router.back();
              }}
            >
              <span>X</span>
            </button>
          </div>
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
}

function OrdersTab() {
  const orders = [
    {
      productName: "Product 1",
      quantity: 2,
      amount: "$40",
      orderDate: "2024-12-01",
    },
    {
      productName: "Product 2",
      quantity: 1,
      amount: "$20",
      orderDate: "2024-11-25",
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Past Orders</h2>
      <div className="overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-gray-700">Product Name</th>
              <th className="p-2 text-gray-700">Quantity</th>
              <th className="p-2 text-gray-700">Amount</th>
              <th className="p-2 text-gray-700">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{order.productName}</td>
                <td className="p-2">{order.quantity}</td>
                <td className="p-2">{order.amount}</td>
                <td className="p-2">{order.orderDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
