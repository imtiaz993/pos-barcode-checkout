"use client";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { app } from "@/app/firebase";
import { toast } from "sonner";
import Loader from "@/components/loader";

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
        console.error("Error fetching client secret:", error);
      });
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
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-black">
                    <th className="p-2 text-gray-700">Code</th>
                    <th className="p-2 text-gray-700">Date</th>
                    <th className="p-2 text-gray-700">Amount</th>
                    <th className="p-2 text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {history && history.length > 0
                    ? history.map((item: any, index: any) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{item.unique_code}</td>
                          <td className="p-2">
                            {new Date(item.purchased_at).toLocaleString(
                              "en-US",
                              {
                                timeZone: "UTC",
                              }
                            )}
                          </td>
                          <td className="p-2">${item.amount}</td>
                          <td className="p-2">${item.balance}</td>
                        </tr>
                      ))
                    : !loading && (
                        <tr>
                          <td colSpan={4} className="p-2 text-center font-medium">No History Found</td>
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
