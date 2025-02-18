import Sidebar from "./components/Sidebar";
import ChatModule from "./components/ChatModule";

export default function Page() {
  return (
    <div className="min-h-dvh max-h-dvh bg-gray-50 flex justify-between">
      <Sidebar />
      <ChatModule />
    </div>
  );
}
