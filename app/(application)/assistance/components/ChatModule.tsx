"use client";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { chatData, taskData } from "./data";
import IntoMessages from "./IntoMessages";
import Refund from "./Refund";

const ChatModule = ({ chatElementRef, setNewTask }: any) => {
  const DeepChat = dynamic(
    () => import("deep-chat-react").then((mod) => mod.DeepChat),
    {
      ssr: false,
    }
  );

  const searchParams = useSearchParams();
  const mode: any = searchParams.get("mode");
  const currentChat: any = searchParams.get("id");

  return (
    <div>
      {/* by setting maxMessages requestBodyLimits to 0 or lower - each request will send full chat history:
    https://deepchat.dev/docs/connect/#requestBodyLimits */}
      {/* If you don't want to or can't edit the target service, you can process the outgoing message using
    responseInterceptor and the incoming message using responseInterceptor:
    https://deepchat.dev/docs/interceptors */}

      {mode === "tasks" &&
        taskData.find((chat: any) => chat.id == currentChat)?.paymentStatus && (
          <Refund
            paymentIntentId={
              taskData.find((chat: any) => chat.id == currentChat)
                ?.paymentIntent?.id
            }
          />
        )}
      <DeepChat
        ref={chatElementRef}
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
        connect={{ url: "/api/server" }}
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
        speechToText={true}
        dragAndDrop={true}
        images={{ button: { position: "dropup-menu" } }}
        gifs={{ button: { position: "dropup-menu" } }}
        camera={{ button: { position: "dropup-menu" } }}
        audio={{ button: { position: "dropup-menu" } }}
        mixedFiles={{ button: { position: "dropup-menu" } }}
        //@ts-ignore
        history={
          (mode === "chats" ? chatData : taskData).find(
            (chat: any) => chat.id == currentChat
          )?.chats || []
        }
        validateInput={(text?: string, files?: File[]) => {
          return (!!files && files.length > 0) || !!text;
        }}
        requestBodyLimits={{ maxMessages: 1 }}
        requestInterceptor={(details: any) => {
          const request = {
            ...details, // Preserve all existing properties
            body: {
              ...details.body, // Keep existing body properties
              identifier: mode, // Dynamically add identifier
            },
          };

          return request;
        }}
        responseInterceptor={(response: any) => {
          if (response.html) {
            setNewTask(true);
          }
          return response;
        }}
      >
        <IntoMessages />
      </DeepChat>
    </div>
  );
};

export default ChatModule;
