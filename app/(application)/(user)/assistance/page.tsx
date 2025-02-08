"use client";
import dynamic from "next/dynamic";

export default function Page() {
  const DeepChat = dynamic(
    () => import("deep-chat-react").then((mod) => mod.DeepChat),
    {
      ssr: false,
    }
  );

  const history = [
    { role: "user", text: "Hey, how are you today?" },
    { role: "ai", text: "I am doing very well!" },
  ];

  return (
    <>
      <div className="max-w-md mx-auto px-4 py-4 ">
        {/* by setting maxMessages requestBodyLimits to 0 or lower - each request will send full chat history:
            https://deepchat.dev/docs/connect/#requestBodyLimits */}
        {/* If you don't want to or can't edit the target service, you can process the outgoing message using
            responseInterceptor and the incoming message using responseInterceptor:
            https://deepchat.dev/docs/interceptors */}

        <DeepChat
          style={{ borderRadius: "10px" }}
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
    </>
  );
}
