"use client";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { app } from "@/utils/firebase";
import { toast } from "sonner";
import Loader from "@/components/loader";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [history, setHistory] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post("https://api.ecoboutiquemarket.com/giftcard/transaction-history", {
        phone_number: user?.phoneNumber,
      })
      .then((res) => {
        setHistory(res.data.transactions);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        setLoading(false);
        console.log("Error fetching client secret:", error);
      });
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-[calc(100dvh-41px-16px-32px)] mx-auto px-4 py-2 max-w-md ">
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
                    <th className="p-2 text-gray-700">Code</th>
                    <th className="p-2 text-gray-700">Date</th>
                    <th className="p-2 text-gray-700">Amount</th>
                    <th className="p-2 text-gray-700">Balance</th>
                    <th className="p-2 text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {history && history.length > 0
                    ? history.map((item: any, index: any) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 whitespace-nowrap">
                            {item.unique_code}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {new Date(item.purchased_at).toLocaleString(
                              "en-US",
                              {
                                timeZone: "UTC",
                              }
                            )}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            ${item.amount.toFixed(2)}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            ${item.balance.toFixed(2)}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {item.used_in_orders.map(
                              (order: any, index: any) => (
                                <Link
                                  key={index}
                                  className="text-blue-600"
                                  href={`/order-history/${order.orderId}`}
                                >
                                  <button className="text-blue-600 hover:text-blue-800">
                                    View Order
                                  </button>
                                </Link>
                              )
                            )}
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
