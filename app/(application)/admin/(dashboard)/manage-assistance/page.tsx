"use client";

import Loader from "@/components/loader";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaPaperPlane, FaComments } from "react-icons/fa";
import Sidebar from "./sidebar";
import { chatData } from "@/app/(application)/assistance/components/data";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { MdFeedback } from "react-icons/md";
import Feedback from "./Feedback";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState(chatData[0]);
  const [showPopup, setShowPopup] = useState(false);

  const fetchChats = async () => {
    try {
      //   const data: any = await axios.get(
      //     "https://www.adminapi.ecoboutiquemarket.com/chats"
      //   );
      //   setChats(data.data.chats);
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
      {showPopup && <Feedback setShowPopup={setShowPopup} />}

      <div className="min-h-[calc(100dvh-60px-16px)] mx-auto px-2 sm:px-4 py-2">
        <div className="w-full mx-auto mt-3 sm:mt-4 flex flex-col min-h-[calc(100dvh-82px)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-700 flex items-center gap-2">
              <FaComments />
              All Chats
            </h1>
          </div>

          <div className="flex flex-grow">
            {/* Chat Table */}
            <Sidebar
              currentChat={currentChat}
              setCurrentChat={setCurrentChat}
            />
            <div className="bg-white shadow-lg rounded-lg flex-grow flex flex-col overflow-hidden ml-2">
              <div className="overflow-auto flex-grow">
                <div className="flex justify-end pb-2">
                  <button className="text-sm bg-blue-600 text-white py-2 px-4 flex items-center gap-2 rounded-lg hover:bg-blue-700 transition">
                    <HiOutlineBadgeCheck /> Auto Approve
                  </button>
                </div>
                <table className="w-full text-left border-collapse text-sm sm:text-base">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr className="text-gray-600">
                      <th className="p-3 sm:p-4">Messages</th>
                      <th className="p-3 sm:p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-base">
                    {currentChat.chats.length > 0 ? (
                      currentChat.chats.map((chat: any, index) =>
                        chat.role === "user" ? (
                          <tr key={index}>
                            <td
                              className="w-full text-gray-700 pt-5 border-t border-l border-r border-black"
                              colSpan={2}
                            >
                              <div className="px-2 sm:px-3 bg-white rounded-lg">
                                <div className="border-l-4 border-blue-500 pl-3 text-gray-600 italic mb-2">
                                  {/* Could be text or file from user */}
                                  {chat?.text && chat.text.length > 100
                                    ? chat.text.slice(0, 100) + "..."
                                    : chat.text}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={index}>
                            <td className="w-full text-gray-700 border-b border-l border-black">
                              {/* Could be text, file or html from server */}
                              {chat?.text && (
                                <textarea
                                  className="px-3 sm:px-2 py-1 resize-none border w-full outline-none"
                                  value={chat.text}
                                  rows={3}
                                />
                              )}
                              {chat?.html && (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: chat.html,
                                  }}
                                ></div>
                              )}
                            </td>
                            <td className="px-3 sm:px-4 text-center border-b border-r border-black">
                              <button
                                onClick={() => {
                                  setShowPopup(true);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white w-full px-2 py-1 mb-1 rounded-lg text-sm flex items-center justify-center gap-2"
                              >
                                <MdFeedback />
                                Fedback
                              </button>
                              <button className="bg-blue-500 hover:bg-blue-600 text-white w-full px-2 py-1 rounded-lg text-sm flex items-center justify-center gap-2">
                                <FaPaperPlane />
                                Send
                              </button>
                            </td>
                          </tr>
                        )
                      )
                    ) : !loading ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="text-center p-6 text-gray-500"
                        >
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
      </div>
    </>
  );
};

export default Page;
