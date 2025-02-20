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

// Chat Mode Buttons (E-commerce Inquiry)
export const chatButtons = [
  { label: "Track My Order", icon: FaShippingFast, color: "#3b82f6" },
  { label: "Customer Support", icon: FaHeadset, color: "#f59e0b" },
  { label: "Check Delivery Status", icon: FaBoxOpen, color: "#6366f1" },
  { label: "Refund Inquiry", icon: FaUndoAlt, color: "#ef4444" },
  { label: "Browse Deals", icon: FaTags, color: "#14b8a6" },
];

// Task Assignment Buttons
export const taskButtons = [
  {
    label: "Create a To-Do List",
    icon: FaClipboardList,
    color: "#3b82f6",
  },
  { label: "Assign a Task", icon: FaTasks, color: "#10b981" },
  {
    label: "Schedule a Meeting",
    icon: FaCalendarCheck,
    color: "#f59e0b",
  },
  { label: "Manage Team", icon: FaUsersCog, color: "#6366f1" },
  { label: "Request a Service", icon: FaToolbox, color: "#ef4444" },
];
