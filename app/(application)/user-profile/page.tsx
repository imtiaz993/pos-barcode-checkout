"use client";
import { useState } from "react";
import Profile from "./components/Profile";
import OrderHistory from "./components/OrderHistory";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-[calc(100dvh-41px)] mx-auto px-4 py-2 max-w-[540px]">
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
      <div className="">
        {activeTab === "profile" ? <Profile /> : <OrderHistory />}
      </div>
    </div>
  );
}
