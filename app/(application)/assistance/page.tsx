"use client";
import Sidebar from "./components/Sidebar";
import ChatModule from "./components/ChatModule";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { chatButtons, taskButtons } from "./components/predefinedButtons";

export default function Page() {
  const chatElementRef: any = useRef(null);
  const searchParams = useSearchParams();
  const mode: any = searchParams.get("mode");
  const predefinedButtons = mode === "chats" ? chatButtons : taskButtons;

  useEffect(() => {
    const attachButtonClickListener = () => {
      const deepChat = document.querySelector("deep-chat");
      if (deepChat) {
        const shadowRoot = deepChat.shadowRoot;
        if (shadowRoot) {
          const buttons = shadowRoot.querySelectorAll("button");
          if (buttons.length > 0) {
            buttons.forEach((button) => {
              button.addEventListener("click", (event: any) => {
                const buttonId = event.target.id;
                const index = buttonId.split("prompt")[1];
                chatElementRef?.current.addMessage({
                  text: predefinedButtons[Number(index)].label,
                  role: "user",
                });
              });
            });
          } else {
            console.log("No buttons found inside shadow DOM.");
          }
        }
      }
    };

    // Delay to ensure deep-chat is fully loaded
    const timer = setTimeout(attachButtonClickListener, 500);
    return () => clearTimeout(timer);
  }, [mode]);

  return (
    <div className="min-h-dvh max-h-dvh bg-gray-50 flex justify-between">
      <Sidebar />
      <ChatModule chatElementRef={chatElementRef} />
    </div>
  );
}
