"use client";
import { useState } from "react";
import { FaHistory, FaTasks } from "react-icons/fa";
import { chatData, taskData } from "../../../assistance/components/data";

const Sidebar = ({ currentChat, setCurrentChat }: any) => {
  const [mode, setMode] = useState("chats");

  return (
    <div
      className={`shadow-lg  w-full md:w-64 inset-0 md:inset-auto bg-black bg-opacity-50 md:bg-transparent z-20 flex md:block`}
    >
      <div className="bg-white flex flex-col h-full w-full md:w-64 px-2">
        <div className="m-1 mb-2 grid grid-cols-2 relative  bg-gray-200 rounded overflow-hidden">
          {/* Animated Background */}
          <div
            className={`absolute top-0 bottom-0 w-1/2 bg-blue-600 transition-all duration-300 ${
              mode === "tasks" ? "translate-x-full" : "translate-x-0"
            }`}
          ></div>

          <div
            onClick={() => {
              setMode("chats");
              setCurrentChat(chatData[0]);
            }}
            className="relative px-4 md:px-2 py-1.5 cursor-pointer text-sm font-medium text-gray-700 transition-colors duration-300"
          >
            <span
              className={`${
                mode === "chats" ? "text-white" : "text-gray-700"
              } flex-1 flex items-center justify-center gap-1.5   z-10`}
            >
              <FaHistory className="text-xs" />
              Chats
            </span>
          </div>

          <div
            onClick={() => {
              setMode("tasks");
              setCurrentChat(taskData[0]);
            }}
            className="relative px-4 md:px-2 py-1.5 cursor-pointer text-sm font-medium text-gray-700 transition-colors duration-300"
          >
            <span
              className={`${
                mode === "tasks" ? "text-white" : "text-gray-700"
              } flex-1 flex items-center justify-center gap-1.5  z-10`}
            >
              <FaTasks className="text-xs" />
              Tasks
            </span>
          </div>
        </div>

        <ul className="flex-1 overflow-auto">
          {(mode === "chats" ? chatData : taskData).map((chat, index) => (
            <p
              key={index}
              onClick={() => {
                setCurrentChat(chat);
              }}
              className={`block px-4 md:px-4 py-2 cursor-pointer  ${
                chat.id == currentChat.id ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="truncate w-[calc(100%-20px)]">
                  {chat.chats[0]?.text}
                </span>
              </div>
            </p>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
