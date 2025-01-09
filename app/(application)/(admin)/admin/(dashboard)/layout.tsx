"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuthState } from "@/utils/firebaseAuth";
import { IoMdMenu } from "react-icons/io";
import Sidebar from "./sidebar";

const Layout = ({ children }: any) => {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      const isLoggedIn = await checkAuthState();
      if (!isLoggedIn) {
        router.replace("/admin/sign-in");
        return;
      }
      setCheckingAuth(false);
    };

    handleAuth();
  }, []);

  if (checkingAuth) {
    return null;
  }

  return (
    <>
      <div className="w-full border-b flex justify-between items-center px-4 py-2 mb-4">
        <div>
          <h1>Eco Boutique</h1>
        </div>

        <button
          className="text-2xl md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <IoMdMenu />
        </button>
      </div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {children}
    </>
  );
};

export default Layout;
