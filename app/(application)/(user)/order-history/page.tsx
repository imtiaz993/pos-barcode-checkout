"use client";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { app } from "@/app/firebase";
import { toast } from "sonner";
import Loader from "@/components/loader";
import Link from "next/link";

const Page = () => {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");

  const router = useRouter();
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [history, setHistory] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post("https://api.ecoboutiquemarket.com/order/history", {
        phone_number: user?.phoneNumber,
      })
      .then((res) => {
        setHistory(res.data.orders);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        setLoading(false);
        console.error("Error fetching client secret:", error);
      });
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-[calc(100dvh-41px-16px)] mx-auto px-4 py-2 max-w-md">
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
          </div>
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-black">
                    <th className="p-2 text-gray-700">Date</th>
                    <th className="p-2 text-gray-700">Store</th>
                    <th className="p-2 text-gray-700">Amount</th>
                    <th className="p-2 text-gray-700">Coupon</th>
                    <th className="p-2 text-gray-700">Order</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {history && history.length > 0
                    ? history.map((item: any, index: any) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 whitespace-nowrap">
                            {new Date(item.orderDate).toLocaleString("en-US", {
                              timeZone: "UTC",
                            })}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {item.storeId.split("s")[1]}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            ${item.totalAmount.toFixed(2)}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {item.couponId || "N/A"}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <Link
                              className="text-blue-600"
                              href={`/order-history/${item.orderId}?type=${type}&region=${region}&storeId=${storeId}`}
                            >
                              <button className="text-blue-600 hover:text-blue-800">
                                View
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    : !loading && (
                        <tr>
                          <td
                            colSpan={4}
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
