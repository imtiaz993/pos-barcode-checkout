"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { checkAuthState } from "@/utils/firebaseAuth";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const type = pathname.includes("/checkout")
    ? "/checkout"
    : pathname.includes("/giftcard")
    ? "/giftcard"
    : "";
  const { region, storeId }: any = useParams();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      const isLoggedIn = await checkAuthState();
      if (!isLoggedIn) {
        router.replace(
          `/sign-in?type=${type}&region=${region}&storeId=${storeId}`
        );
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
