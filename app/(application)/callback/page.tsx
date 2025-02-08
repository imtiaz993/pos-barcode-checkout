"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, handleAuth } from "@/lib/auth";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const region = searchParams.get("region");
  const type = searchParams.get("type");
  const gift_card = searchParams.get("gift_card");
  const phone_number = searchParams.get("phone_number");

  useEffect(() => {
    handleAuth()
      .then(() => {
        if (type == "/activate-gift-card") {
          router.replace(
            `${type}?gift_card=${gift_card}&phone_number=${phone_number}`
          );
        } else {
          router.replace(`${type}/${region}/${storeId}`);
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="rounded-lg shadow-sm border p-6 pt-0 w-full mx-auto max-w-md ">
        <div className="flex justify-center">
          <Image
            priority={true}
            src="/images/logo.png"
            width={0}
            height={0}
            sizes="100vw"
            alt=""
            className="w-auto"
          />
        </div>
        <div>
          <h2 className="text-center text-xl font-medium">
            Processing Login...
          </h2>
          <p className="text-center mt-1">Please wait while we log you in.</p>
        </div>
      </div>
    </div>
  );
}
