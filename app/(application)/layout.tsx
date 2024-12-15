"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { checkAuthState } from "@/utils/firebaseAuth";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const type: any = pathname.includes("/checkout")
    ? "/checkout"
    : pathname.includes("/giftcard")
    ? "/giftcard"
    : pathname.includes("/activate-gift-card")
    ? "/activate-gift-card"
    : "";
  const { region, storeId }: any = useParams();
  const gift_card = searchParams.get("gift_card");
  const [checkingAuth, setCheckingAuth] = useState(true);


  console.log(type);
  
  useEffect(() => {
    const handleAuth = async () => {
      const isLoggedIn = await checkAuthState();
      if (!isLoggedIn) {
        if (type == "/activate-gift-card") {
          router.replace(`/sign-in?type=${type}&gift_card=${gift_card}`);
        } else {
          router.replace(
            `/sign-in?type=${type}&region=${region}&storeId=${storeId}`
          );
        }
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
