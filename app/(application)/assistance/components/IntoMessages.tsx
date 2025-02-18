import {
  FaChalkboardTeacher,
  FaShippingFast,
  FaHeadset,
  FaBoxOpen,
  FaUndoAlt,
  FaTags,
} from "react-icons/fa";

const IntoMessages = () => {
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
    </div>
  );
};

export default IntoMessages;
