"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUserData, getUserToken } from "@/lib/auth";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlParams = useParams();

  // Determine type based on pathname
  let pageType: any = pathname.includes("/checkout")
    ? "/checkout"
    : pathname.includes("/giftcard")
    ? "/giftcard"
    : pathname.includes("/activate-gift-card")
    ? "/activate-gift-card"
    : "";

  // Get region, storeId from URL params or query params
  const region = urlParams?.region || searchParams.get("region");
  const storeId = urlParams?.storeId || searchParams.get("storeId");
  const type = pageType || searchParams.get("type");
  const gift_card = searchParams.get("gift_card");
  const phone_number = searchParams.get("phone_number");

  const [checkingAuth, setCheckingAuth] = useState(true);

  const user = getUserData();
  const accessToken = getUserToken();

  useEffect(() => {
    const handleAuth = async () => {
      if (user && accessToken) {
        //TODO: change admin as per Auth0
        if (user?.claims?.admin) {
          router.replace("/admin/order-history");
        }
      } else if (!user && !accessToken) {
        if (type === "/activate-gift-card") {
          router.replace(
            `/sign-in?type=${type}&gift_card=${gift_card}&phone_number=${phone_number}`
          );
        } else {
          router.replace(
            `/sign-in?type=${type}&region=${region}&storeId=${storeId}`
          );
        }
      }
      setCheckingAuth(false);
    };
    handleAuth();
  }, [type, region, storeId, gift_card, , phone_number]);

  if (checkingAuth) {
    return null;
  }

  return (
    <div className="pb-4 max-w-md mx-auto">
      <div className="w-full border-b flex justify-between items-center px-4 py-2">
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
            alt="Profile"
            className="w-8 cursor-pointer"
          />
        </Link>
      </div>
      {children}
    </div>
  );
};

export default Layout;
