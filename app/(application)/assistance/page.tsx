"use client";
import Sidebar from "./components/Sidebar";
import ChatModule from "./components/ChatModule";
import IntoMessages from "./components/IntoMessages";
import { useRef } from "react";

export default function Page() {
  const chatElementRef = useRef(null);
  return (
    <div className="min-h-dvh max-h-dvh bg-gray-50 flex justify-between">
      <Sidebar />
      <ChatModule chatElementRef={chatElementRef} />
      <IntoMessages chatElementRef={chatElementRef} />
    </div>
  );
}
