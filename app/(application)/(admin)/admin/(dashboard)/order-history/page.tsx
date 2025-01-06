"use client";

import axios from "axios";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { app } from "@/app/firebase";
import { toast } from "sonner";
import Loader from "@/components/loader";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [history, setHistory] = useState<any>();
  const [loading, setLoading] = useState(true);

  const [storeId, setStoreId] = useState(""); // Filter for store ID
  const [startDate, setStartDate] = useState(""); // Filter for start date
  const [endDate, setEndDate] = useState(""); // Filter for end date

  const fetchHistory = () => {
    setLoading(true);

    // Construct query parameters
    const params: any = {};
    if (storeId) params.storeId = storeId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    axios
      .post("https://api.ecoboutiquemarket.com/order/history", params)
      .then((res) => {
        setHistory(res.data.orders);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Error fetching data");
        setLoading(false);
        console.error("Error fetching client secret:", error);
      });
  };

  useEffect(() => {
    fetchHistory(); // Fetch history on component load
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-[calc(100dvh-41px-16px)] mx-auto px-4 py-2 max-w-md">
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
          </div>

          {/* Filter Section */}
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="text-lg font-semibold mb-2">Filters</h3>
            <div className="flex flex-col gap-4">
              {/* Store ID Dropdown */}
              <div>
                <label htmlFor="storeId" className="block text-sm font-medium">
                  Store ID
                </label>
                <select
                  id="storeId"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg text-sm"
                >
                  <option value="">All Stores</option>
                  <option value="110">110</option>
                  <option value="111">111</option>
                  <option value="112">112</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="endDate" className="block text-sm font-medium">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={fetchHistory}
                className="text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Order Table */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-black">
                    <th className="p-2 text-gray-700">Order</th>
                    <th className="p-2 text-gray-700">Date</th>
                    <th className="p-2 text-gray-700">Store</th>
                    <th className="p-2 text-gray-700">Amount</th>
                    <th className="p-2 text-gray-700">Coupon</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {history && history.length > 0 ? (
                    history.map((item: any, index: any) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          <Link
                            href={`/admin/order-history/${item.orderId}`}
                            className="text-blue-500"
                          >
                            {item.orderId}
                          </Link>
                        </td>
                        <td className="p-2">
                          {new Date(item.orderDate).toLocaleString("en-US", {
                            timeZone: "UTC",
                          })}
                        </td>
                        <td className="p-2">{item.storeId}</td>
                        <td className="p-2">${item.totalAmount}</td>
                        <td className="p-2">{item.couponId || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-2 text-center font-medium"
                      >
                        No History Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
