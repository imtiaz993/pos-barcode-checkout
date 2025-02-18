"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FaComments, FaHistory, FaPen, FaTimes, FaTasks } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { data } from "./data";

const Sidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");

  const currentChat: any = searchParams.get("id");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mode, setMode] = useState("chat");

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
                router.push(
                  `/assistance?type=${type}&region=${region}&storeId=${storeId}`
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
        className={`w-full md:w-64 fixed inset-0 md:inset-auto bg-black bg-opacity-50 z-20 flex ${
          isDrawerOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="flex flex-col h-full bg-gray-100 w-full md:w-64">
          <div className="px-4 md:px-2 py-2 border-b border-gray-700 font-semibold flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
            >
              &larr; Back
            </button>
            <button
              className="text-black p-2 rounded-full hidden md:block"
              onClick={() =>
                router.push(
                  `/assistance?type=${type}&region=${region}&storeId=${storeId}`
                )
              }
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
                mode === "chat" ? "bg-blue-600 text-white" : "bg-gray-300"
              } `}
              onClick={() => {
                setMode("chat");
              }}
            >
              <FaHistory className="text-xs" /> Chats
            </div>
            <div
              className={`flex items-center justify-center gap-1.5 px-4 md:px-2 py-1 cursor-pointer rounded-r ${
                mode === "task" ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
              onClick={() => {
                setMode("task");
              }}
            >
              <FaTasks className="text-xs" />
              Tasks
            </div>
          </div>
          <ul className="flex-1 overflow-auto">
            {data.map((chat, index) => (
              <Link
                key={index}
                href={`/assistance?id=${chat.id}&type=${type}&region=${region}&storeId=${storeId}`}
                replace={true}
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
                className={`block px-4 md:px-2 py-2  ${
                  chat.id == currentChat ? "bg-gray-300" : "hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaComments className="text-blue-400" />
                  <span className="truncate">{chat.chats[0].text}</span>
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
