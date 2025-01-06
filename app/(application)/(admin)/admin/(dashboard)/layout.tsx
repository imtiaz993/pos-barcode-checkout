"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuthState } from "@/utils/firebaseAuth";

const Layout = ({ children }: any) => {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);

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

  return children;
};

export default Layout;
