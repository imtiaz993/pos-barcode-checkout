"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { auth } from "@/app/firebase";
import Loader from "@/components/loader";
import { logout } from "@/utils/firebaseAuth";

export default function Page() {
  const router = useRouter();

  const [activating, setActivating] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const gift_card = searchParams.get("gift_card");
  const phone_number = searchParams.get("phone_number");
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/sign-in");
    } catch (error) {
      alert("Failed to log out. Please try again.");
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    if (user) {
      if (phone_number === user.phoneNumber) {
        axios
          .post("https://api.ecoboutiquemarket.com/giftcard/activate", {
            unique_code: gift_card,
            phone_number: user?.phoneNumber,
          })
          .then(() => {
            setActivating(false);
          })
          .catch((error) => {
            setActivating(false);
            setError(error?.response?.data?.message);
            toast.error(error?.response?.data?.message);
            console.log(error.response.data.message);
          });
      } else {
        handleLogout();
      }
    }
  }, [user]);

  return (
    <>
      {activating && <Loader />}
      <div className="max-w-md mx-auto px-4 py-4 ">
        {activating ? (
          <h1 className="text-xl font-bold mb-4 text-center">
            Activating your{" "}
            <span className="text-blue-600">
              Virtual Gift Card ({gift_card}){" "}
            </span>
          </h1>
        ) : (
          !error && (
            <>
              <h1 className="text-xl font-bold mb-4 text-center">
                Your{" "}
                <span className="text-blue-600">
                  Virtual Gift Card ({gift_card}){" "}
                </span>{" "}
                has been activated successfully!
              </h1>
              <h2 className="text-lg font-semibold mb-4 text-center">
                Giftcard balance added to your account, feel free to use it on
                your future eco-boutique purchases
              </h2>
            </>
          )
        )}

        {/* Card Preview */}
        <div className="w-full rounded-lg overflow-hidden mb-8 flex items-center justify-center">
          <Image
            priority={true}
            src="/images/gift_card.png"
            width={0}
            height={0}
            sizes="100vw"
            alt=""
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}
