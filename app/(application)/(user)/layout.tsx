"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { checkAuthState } from "@/utils/firebaseAuth";
import Link from "next/link";
import Image from "next/image";

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

  return (
    <>
      <div className="w-full border-b flex justify-between items-center px-4 py-1">
        <div>
          <h1>Eco Boutique</h1>
        </div>
        <Link
          href={`/user-profile?type=${type}&region=${region}&storeId=${storeId}`}
        >
          <Image
            priority={true}
            src="/images/profile.png"
            width={0}
            height={0}
            sizes="100vw"
            alt=""
            className="w-8 cursor-pointer"
          />
        </Link>
      </div>
      {children}
    </>
  );
};

export default Layout;
