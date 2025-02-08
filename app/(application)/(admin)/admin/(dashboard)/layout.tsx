"use client";

import { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import Sidebar from "./sidebar";
import Image from "next/image";
import { getUserData, getUserToken, logout } from "@/lib/auth";

const Layout = ({ children }: any) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = getUserData();
  const isLoggedIn = getUserToken();

  useEffect(() => {
    const handleAuth = async () => {
      //TODO: change admin as per Auth0
      if (!isLoggedIn || (user && !user?.claims?.admin)) {
        if (!user?.claims?.admin) {
          logout("/sign-in");
        }
      }

      setCheckingAuth(false);
    };

    handleAuth();
  }, [user]);

  const handleLogout = async () => {
    try {
      logout("/admin/sign-in");
    } catch (error) {
      alert("Failed to log out. Please try again.");
      console.error("Error during logout:", error);
    }
  };

  if (checkingAuth) {
    return null;
  }

  return (
    <>
      <div className="w-full border-b flex justify-between items-center px-4 py-2">
        <div>
          <h1>Eco Boutique</h1>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={handleLogout}
            className="bg-blue-600 text-white py-2 px-3 text-sm rounded-lg flex items-center "
          >
            <Image
              priority={true}
              src="/images/logout.svg"
              width={0}
              height={0}
              sizes="100vw"
              alt=""
              className="w-4 cursor-pointer mr-1"
            />
          </button>
          <button
            className="text-2xl lg:hidden ml-4"
            onClick={() => setSidebarOpen(true)}
          >
            <IoMdMenu />
          </button>
        </div>
      </div>
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="w-full">{children}</div>
      </div>
    </>
  );
};

export default Layout;
