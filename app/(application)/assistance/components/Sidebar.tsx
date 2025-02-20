"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FaComments, FaHistory, FaPen, FaTimes, FaTasks } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { chatData, taskData } from "./data";
import { MdOutlineAddTask } from "react-icons/md";

const Sidebar = ({ setNewChat }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");

  const mode: any = searchParams.get("mode");
  const currentChat: any = searchParams.get("id");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div>
      {!isDrawerOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 border-b flex justify-between items-center px-4 py-2 bg-white">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
          >
            &larr; Back
          </button>
          <div className="flex items-center gap-2">
            <button
              className="text-black rounded-full md:hidden"
              onClick={() => {
                setNewChat((prev: any) => !prev);
                router.replace(
                  `/assistance?mode=${mode}&type=${type}&region=${region}&storeId=${storeId}`
                );
              }}
            >
              <FaPen />
            </button>

            <button
              className="text-black rounded-full md:hidden"
              onClick={() => setIsDrawerOpen(true)}
            >
              <IoMdMenu className="text-xl" />
            </button>
          </div>
        </div>
      )}
      <div
        className={`w-full md:w-64 fixed inset-0 md:inset-auto bg-black bg-opacity-50 md:bg-transparent z-20 flex ${
          isDrawerOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="bg-white flex flex-col h-full w-full md:w-64">
          <div className="px-4 md:px-2 py-2 border-b border-gray-700 font-semibold flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
            >
              &larr; Back
            </button>
            <button
              className="text-black p-2 rounded-full hidden md:block"
              onClick={() => {
                setNewChat((prev: any) => !prev);
                router.replace(
                  `/assistance?mode=${mode}&type=${type}&region=${region}&storeId=${storeId}`
                );
              }}
            >
              <FaPen />
            </button>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="md:hidden"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
          <div className="p-1 pb-2 grid grid-cols-2">
            <div
              className={`flex items-center justify-center gap-1.5 px-4 md:px-2 py-1 cursor-pointer rounded-l ${
                mode === "chats" ? "bg-blue-600 text-white" : "bg-gray-200"
              } `}
              onClick={() => {
                router.replace(
                  `/assistance?mode=${"chats"}&type=${type}&region=${region}&storeId=${storeId}`
                );
              }}
            >
              <FaHistory className="text-xs" /> Chats
            </div>
            <div
              className={`flex items-center justify-center gap-1.5 px-4 md:px-2 py-1 cursor-pointer rounded-r ${
                mode === "tasks" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => {
                router.replace(
                  `/assistance?mode=${"tasks"}&type=${type}&region=${region}&storeId=${storeId}`
                );
              }}
            >
              <FaTasks className="text-xs" />
              Tasks
            </div>
          </div>
          <ul className="flex-1 overflow-auto">
            {(mode === "chats" ? chatData : taskData).map((chat, index) => (
              <Link
                key={index}
                href={`/assistance?id=${chat.id}&mode=${mode}&type=${type}&region=${region}&storeId=${storeId}`}
                replace={true}
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
                className={`block px-4 md:px-2 py-2  ${
                  chat.id == currentChat ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  {mode == "chats" ? (
                    <FaComments className="text-blue-400" />
                  ) : (
                    <MdOutlineAddTask className="text-blue-400" />
                  )}
                  <span className="truncate w-[calc(100%-20px)]">
                    {chat.chats[0]?.text}
                  </span>
                </div>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
