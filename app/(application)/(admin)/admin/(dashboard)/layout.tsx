"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuthState, logout } from "@/utils/firebaseAuth";
import { IoMdMenu } from "react-icons/io";
import Sidebar from "./sidebar";
import { getAuth } from "firebase/auth";
import { app } from "@/app/firebase";
import Image from "next/image";

const Layout = ({ children }: any) => {
  const router = useRouter();

  const auth = getAuth(app);
  const user = auth.currentUser;

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      const isLoggedIn = await checkAuthState();
      const token = await user?.getIdTokenResult();
      console.log(isLoggedIn, !token?.claims?.admin);

      if (!isLoggedIn || (user && !token?.claims?.admin)) {
        if (!token?.claims?.admin) {
          await logout();
        }
        router.replace("/sign-in");
      }

      setCheckingAuth(false);
    };

    handleAuth();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/admin/sign-in");
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
      <div className="w-full border-b flex justify-between items-center px-4 py-2 mb-4">
        <div>
          <h1>Eco Boutique</h1>
        </div>

        {/* <button className="text-2xl" onClick={() => setSidebarOpen(true)}>
          <IoMdMenu />
        </button> */}
        <button
          type="button"
          onClick={handleLogout}
          className="bg-blue-500 text-white py-2 px-3 text-sm rounded-lg hover:bg-blue-600 flex items-center"
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
      </div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {children}
    </>
  );
};

export default Layout;
