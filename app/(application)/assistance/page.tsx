"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  FaComments,
  FaHistory,
  FaPen,
  FaTimes,
  FaChalkboardTeacher,
  FaShippingFast,
  FaHeadset,
  FaBoxOpen,
  FaUndoAlt,
  FaTags,
} from "react-icons/fa";
import { data } from "./data";

export default function Page() {
  const DeepChat = dynamic(
    () => import("deep-chat-react").then((mod) => mod.DeepChat),
    {
      ssr: false,
    }
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");

  const currentChat = searchParams.get("id");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const buttonStyle = {
    padding: "12px 14px",
    borderRadius: "25px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    whiteSpace: "noWrap",
  };

  const buttons = [
    { label: "Find a Tutor", icon: <FaChalkboardTeacher />, color: "#10b981" },
    { label: "Track My Order", icon: <FaShippingFast />, color: "#3b82f6" },
    { label: "Customer Support", icon: <FaHeadset />, color: "#f59e0b" },
    { label: "Check Delivery Status", icon: <FaBoxOpen />, color: "#6366f1" },
    { label: "Refund Inquiry", icon: <FaUndoAlt />, color: "#ef4444" },
    { label: "Browse Deals", icon: <FaTags />, color: "#14b8a6" },
  ];

  return (
    <div className="min-h-dvh max-h-dvh bg-gray-50 flex justify-between">
      <div>
        {!isDrawerOpen && (
          <div className="md:hidden fixed top-0 left-0 right-0 z-30 border-b flex justify-between items-center px-2 py-1 bg-white">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
            >
              &larr; Back
            </button>
            <div>
              <button
                className="text-black p-2 rounded-full md:hidden"
                onClick={() => {
                  router.push(
                    `/assistance?type=${type}&region=${region}&storeId=${storeId}`
                  );
                }}
              >
                <FaPen />
              </button>

              <button
                className="text-black p-2 rounded-full md:hidden"
                onClick={() => setIsDrawerOpen(true)}
              >
                <FaHistory />
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
            <div className="p-4 border-b border-gray-700 font-semibold flex justify-between items-center">
              <span className="flex items-center">
                <FaHistory className="mr-2" />
                Chat History
              </span>
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
                className="text-gray-400 md:hidden"
              >
                <FaTimes />
              </button>
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
                  className="block px-4 py-2 hover:bg-gray-200"
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

      <div>
        {/* by setting maxMessages requestBodyLimits to 0 or lower - each request will send full chat history:
            https://deepchat.dev/docs/connect/#requestBodyLimits */}
        {/* If you don't want to or can't edit the target service, you can process the outgoing message using
            responseInterceptor and the incoming message using responseInterceptor:
            https://deepchat.dev/docs/interceptors */}

        <DeepChat
          // introMessage={{
          //   text: currentChat ? "" : "Hi I am your assistant, ask me anything!",
          // }}
          attachmentContainerStyle={{ backgroundColor: "#b2e1ff57" }}
          inputAreaStyle={{ backgroundColor: "#f2f2f2" }}
          textInput={{
            styles: {
              container: { maxHeight: "80px" },
            },
            placeholder: { text: "Type a message to get assistance" },
          }}
          messageStyles={{
            loading: {
              message: {
                styles: {
                  bubble: { backgroundColor: "#6decff", color: "white" },
                },
              },
              history: {
                small: {
                  styles: {
                    outerContainer: { marginBottom: "60px" },
                    bubble: {
                      color: "#6decff",
                      border: "11px solid",
                      height: "80px",
                      width: "80px",
                    },
                  },
                },
              },
            },
          }}
          connect={{ url: "/api/custom/files" }}
          avatars={{
            ai: {
              src: "https://app.ecoboutiquemarket.com/images/logo.png",
              styles: { avatar: { width: "50px", height: "50px" } },
            },
          }}
          // avatars={true}
          // avatars={{
          //   default: {styles: {avatar: {height: "30px", width: "30px"}, container: {marginTop: "8px"}}},
          //   ai: {src: "path-to-file.svg", styles: {avatar: {marginLeft: "-3px"}}},
          //   bob: {src: "path-to-file.png", styles: {avatar: {borderRadius: "15px"}}}
          // }}
          displayLoadingBubble={true}
          // textToSpeech={true}
          speechToText={{ webSpeech: { language: "en-US" } }}
          dragAndDrop={true}
          images={{ button: { position: "dropup-menu" } }}
          gifs={{ button: { position: "dropup-menu" } }}
          camera={{ button: { position: "dropup-menu" } }}
          audio={{ button: { position: "dropup-menu" } }}
          mixedFiles={{ button: { position: "dropup-menu" } }}
          microphone={{ button: { position: "outside-right" } }}
          //@ts-ignore
          history={
            data.find((chat: any) => chat.id == currentChat)?.chats || []
          }
          validateInput={(_?: string, files?: File[]) => {
            return !!files && files.length > 0;
          }}
          requestBodyLimits={{ maxMessages: -1 }}
          requestInterceptor={(details: any) => {
            console.log(details);
            return details;
          }}
          responseInterceptor={(response: any) => {
            console.log(response);
            return response;
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "24px",
              }}
            >
              What can I help you with?
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "10px",
                maxWidth: "500px",
                width: "100%",
              }}
            >
              {buttons.map((btn, index) => (
                <button key={index} style={buttonStyle}>
                  <span style={{ color: btn.color, fontSize: "16px" }}>
                    {btn.icon}
                  </span>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </DeepChat>
      </div>
    </div>
  );
}
