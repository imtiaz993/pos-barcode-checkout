import { useSearchParams } from "next/navigation";
import { chatButtons, taskButtons } from "./predefinedButtons";
import React from "react";

const IntoMessages = () => {
  const searchParams = useSearchParams();
  const mode: any = searchParams.get("mode");

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
    whiteSpace: "nowrap",
    transition: "background-color 0.3s ease",
  };

  const buttons = mode === "chats" ? chatButtons : taskButtons;

  return (
    <div>
      <div>
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
              textAlign: "center",
            }}
          >
            {mode === "chats"
              ? "How can I assist you today?"
              : "What task would you like to assign?"}
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "12px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            {buttons.map((btn, index) => (
              <button id={"prompt" + index} key={index} style={buttonStyle}>
                <span style={{ color: btn.color, fontSize: "16px" }}>
                  {React.createElement(btn.icon)}
                </span>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntoMessages;
