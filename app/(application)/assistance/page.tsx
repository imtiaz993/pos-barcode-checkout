"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaComments, FaHistory, FaTimes } from "react-icons/fa";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const history = [
    { role: "user", text: "Hey, how are you today?" },
    { role: "ai", text: "I am doing very well!" },
    { role: "user", text: "Hey, how are you today?" },
    { role: "ai", text: "I am doing very well!" },
    { role: "user", text: "Hey, how are you today?" },
    { role: "ai", text: "I am doing very well!" },
    { role: "user", text: "Hey, how are you today?" },
    { role: "ai", text: "I am doing very well!" },
    { role: "user", text: "Hey, how are you today?" },
    { role: "ai", text: "I am doing very well!" },
    { role: "user", text: "Hey, how are you today?" },
    { role: "ai", text: "I am doing very well!" },
    { role: "user", text: "Hey, how are you today?" },
    { role: "ai", text: "I am doing very well!" },
    { role: "user", text: "Hey, how are you today?" },
    { role: "ai", text: "I am doing very well!" },
    { role: "ai", text: "I am doing very well!" },
    { role: "user", text: "Hey, how are you today?" },
    { role: "ai", text: "I am doing very wells!" },
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
            <button
              className="text-black p-2 rounded-full md:hidden"
              onClick={() => setIsDrawerOpen(true)}
            >
              <FaHistory />
            </button>
          </div>
        )}
        <div
          className={`w-full md:w-64 fixed inset-0 md:inset-auto bg-black bg-opacity-50 z-20 flex ${
            isDrawerOpen ? "block" : "hidden"
          } md:block`}
        >
          <div className="flex flex-col h-full bg-gray-100 w-full md:w-64">
            <div className="p-4 border-b border-gray-700 font-bold flex justify-between items-center">
              <span className="flex items-center">
                <FaHistory className="mr-2" />
                Chat History
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-400 md:hidden"
              >
                <FaTimes />
              </button>
            </div>
            <ul className="flex-1 overflow-auto">
              {history.map((chat, index) => (
                <Link
                  key={index}
                  href={`/assistance?id=${index}&type=${type}&region=${region}&storeId=${storeId}`}
                  replace={true}
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <FaComments className="text-blue-400" />
                    <span className="truncate">{chat.text}</span>
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
          introMessage={{ text: "Ecoboutique AI Assistance" }}
          connect={{ url: "/api/custom/files" }}
          displayLoadingBubble={true}
          textToSpeech={true}
          speechToText={true}
          audio={true}
          dragAndDrop={true}
          images={true}
          gifs={true}
          camera={true}
          microphone={true}
          mixedFiles={true}
          history={history}
          textInput={{ placeholder: { text: "Type a message!" } }}
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
        />
      </div>
    </div>
  );
}
