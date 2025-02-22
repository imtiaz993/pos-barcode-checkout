"use client";

import Loader from "@/components/loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      //   const data: any = await axios.get(
      //     "https://www.adminapi.ecoboutiquemarket.com/chats"
      //   );
      //   setChats(data.data.chats);
      setChats([{ message: "Hello?" }, { message: "Need Help." }]);
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.log("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);
  return (
    <>
      {loading && <Loader />}

      <div className="min-h-[calc(100dvh-60px-16px)] mx-auto px-2 sm:px-4 py-2">
        <div className="w-full mx-auto  mt-3 sm:mt-4 flex flex-col min-h-[calc(100dvh-82px)]">
          <div className="flex justify-between mb-3 sm:mb-5 ">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-700">
              All Chats
            </h1>
          </div>
          <div className="bg-white shadow-lg rounded-lg flex-grow flex flex-col overflow-hidden">
            <div className="overflow-auto flex-grow">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead className="sticky top-0 bg-gray-100 ">
                  <tr>
                    <th className="p-2 sm:p-4">Message</th>
                    <th className="p-2 sm:p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-base">
                  {chats.length > 0 ? (
                    chats.map((chat, index) => (
                      <tr
                        key={index}
                        className={`border-b ${
                          index % 2 == 0 ? "" : "bg-gray-50"
                        }`}
                      >
                        <td className="p-2 sm:p-4 whitespace-nowrap w-full">
                          {chat.message}
                        </td>
                        <td className="p-2 sm:p-4 whitespace-nowrap cursor-pointer">
                          Send
                        </td>
                      </tr>
                    ))
                  ) : !loading ? (
                    <tr>
                      <td colSpan={8} className="text-center p-2 sm:p-4">
                        No records found
                      </td>
                    </tr>
                  ) : null}
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
