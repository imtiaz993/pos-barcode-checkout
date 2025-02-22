"use client";

import Loader from "@/components/loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaPaperPlane, FaComments } from "react-icons/fa";

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
      toast.error(error.response?.data?.error || "Failed to fetch chats");
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
        <div className="w-full mx-auto mt-3 sm:mt-4 flex flex-col min-h-[calc(100dvh-82px)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-700 flex items-center gap-2">
              <FaComments />
              All Chats
            </h1>
          </div>

          {/* Chat Table */}
          <div className="bg-white shadow-lg rounded-lg flex-grow flex flex-col overflow-hidden">
            <div className="overflow-auto flex-grow">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead className="sticky top-0 bg-gray-100">
                  <tr className="text-gray-600">
                    <th className="p-3 sm:p-4">Message</th>
                    <th className="p-3 sm:p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-base">
                  {chats.length > 0 ? (
                    chats.map((chat, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 == 0 ? "bg-gray-50" : ""}`}
                      >
                        <td className="w-full text-gray-700">
                          <textarea
                            className="p-3 sm:p-4 resize-none border w-full outline-none"
                            value={chat.message}
                          />
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg text-sm flex items-center justify-center gap-2">
                            <FaPaperPlane />
                            Send
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : !loading ? (
                    <tr>
                      <td colSpan={2} className="text-center p-6 text-gray-500">
                        <div className="flex flex-col items-center justify-center py-6">
                          <svg
                            className="w-12 h-12 text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12H9m6 4H9m10 2.5a2.5 2.5 0 11-5 0m5 0H5a2.5 2.5 0 110-5h14a2.5 2.5 0 110 5zM5 10h14M5 6h14M9 14h6"
                            ></path>
                          </svg>
                          <p className="text-gray-600 text-sm sm:text-base font-medium">
                            No chats found
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            Messages will appear here when received.
                          </p>
                        </div>
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
