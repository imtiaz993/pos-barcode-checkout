import { useSearchParams } from "next/navigation";
import {
  FaShippingFast,
  FaHeadset,
  FaBoxOpen,
  FaUndoAlt,
  FaTags,
  FaClipboardList,
  FaTasks,
  FaCalendarCheck,
  FaUsersCog,
  FaToolbox,
} from "react-icons/fa";

const IntoMessages = ({ chatElementRef }: any) => {
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

  // Chat Mode Buttons (E-commerce Inquiry)
  const chatButtons = [
    { label: "Track My Order", icon: <FaShippingFast />, color: "#3b82f6" },
    { label: "Customer Support", icon: <FaHeadset />, color: "#f59e0b" },
    { label: "Check Delivery Status", icon: <FaBoxOpen />, color: "#6366f1" },
    { label: "Refund Inquiry", icon: <FaUndoAlt />, color: "#ef4444" },
    { label: "Browse Deals", icon: <FaTags />, color: "#14b8a6" },
  ];

  // Task Assignment Buttons
  const taskButtons = [
    {
      label: "Create a To-Do List",
      icon: <FaClipboardList />,
      color: "#3b82f6",
    },
    { label: "Assign a Task", icon: <FaTasks />, color: "#10b981" },
    {
      label: "Schedule a Meeting",
      icon: <FaCalendarCheck />,
      color: "#f59e0b",
    },
    { label: "Manage Team", icon: <FaUsersCog />, color: "#6366f1" },
    { label: "Request a Service", icon: <FaToolbox />, color: "#ef4444" },
  ];

  const buttons = mode === "chats" ? chatButtons : taskButtons;

  return (
    <div className="fixed top-0 right-0 left-64 bottom-16">
      <div className="absolute inset-0 flex items-center justify-center">
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
              <button
                key={index}
                style={buttonStyle}
                onClick={() => {
                  chatElementRef.current.addMessage({
                    text: btn.label,
                    role: "user",
                  });
                }}
              >
                <span style={{ color: btn.color, fontSize: "16px" }}>
                  {btn.icon}
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
