"use client";
import Sidebar from "./components/Sidebar";
import ChatModule from "./components/ChatModule";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { chatButtons, taskButtons } from "./components/predefinedButtons";
import Payment from "@/components/Payment";
import Loader from "@/components/loader";

export default function Page() {
  const chatElementRef: any = useRef(null);
  const searchParams = useSearchParams();
  const mode: any = searchParams.get("mode");
  const id: any = searchParams.get("id");
  const predefinedButtons = mode === "chats" ? chatButtons : taskButtons;

  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newChat, setNewChat] = useState(null);

  useEffect(() => {
    const attachButtonClickListener = () => {
      const deepChat = document.querySelector("deep-chat");
      if (deepChat) {
        const shadowRoot = deepChat.shadowRoot;
        if (shadowRoot) {
          const paymentButton: any = shadowRoot.getElementById("takePayment");
          if (paymentButton) {
            paymentButton.addEventListener("click", (event: any) => {
              const buttonId = event.target.id;
              console.log("CLICKED");
              setLoading(true);
              setShowCheckout(true);
            });
          }
          const buttons = shadowRoot.querySelectorAll("button");
          if (buttons.length > 0) {
            buttons.forEach((button) => {
              button.addEventListener("click", (event: any) => {
                const buttonId = event.target.id;
                const index = buttonId.split("prompt")[1];
                chatElementRef?.current.submitUserMessage({
                  text: predefinedButtons[Number(index)].label,
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
  }, [mode, id, newChat]);

  return (
    <div className="min-h-dvh max-h-dvh bg-gray-50 flex justify-between">
      {loading && <Loader />}
      {showCheckout ? (
        <Payment
          price={100}
          onSuccess={() => {
            setLoading(false);
            setShowCheckout(false);
          }}
          onCancel={() => {
            setLoading(false);
            setShowCheckout(false);
          }}
          onPaymentCreatedIntent={() => {
            setLoading(false);
            setShowCheckout(false);
          }}
        />
      ) : (
        <></>
      )}
      <Sidebar setNewChat={setNewChat} />
      <ChatModule chatElementRef={chatElementRef} />
    </div>
  );
}
