"use client";

import Loader from "@/components/loader";
import axios from "axios";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { toast } from "sonner";

export default function Page() {
  const [activating, setActivating] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const gift_card = searchParams.get("gift_card");
  const user = auth.currentUser;

  useEffect(() => {
    axios
      .post("https://api.ecoboutiquemarket.com/api/activate-gift-card", {
        gift_card: gift_card,
        phone: user?.phoneNumber,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        setActivating(false);
        setError(error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
        console.error("Error fetching client secret:", error);
      });
  }, []);

  return (
    <>
      {activating && <Loader />}
      <div className="max-w-lg mx-auto px-4 py-6">
        {activating ? (
          <h1 className="text-xl font-bold mb-4 text-center">
            Activating your{" "}
            <span className="text-blue-600">
              Virtual Gift Card ({gift_card}){" "}
            </span>
          </h1>
        ) : (
          !error && (
            <h1 className="text-xl font-bold mb-4 text-center">
              Your{" "}
              <span className="text-blue-600">
                Virtual Gift Card ({gift_card}){" "}
              </span>{" "}
              has been activated successfully!
            </h1>
          )
        )}

        {/* Card Preview */}
        <div className="w-full rounded-lg overflow-hidden mb-8 flex items-center justify-center">
          <Image
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