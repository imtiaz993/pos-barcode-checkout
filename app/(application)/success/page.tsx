"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const region = searchParams.get("region");
  const storeId = searchParams.get("storeId");

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center min-h-dvh mx-auto w-11/12">
        <div className="mb-6">
          <Image
            priority={true}
            src="/images/check.png"
            alt="Success"
            width={150}
            height={150}
          />
        </div>

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 text-center max-w-md">
          Thank you for your payment. Your transaction was completed
          successfully.
        </p>

        <button
          className="w-full bg-blue-600 text-white py-2 text-sm rounded-lg  mt-6"
          autoFocus
        >
          <Link href={`/${region}/${storeId}`}>Go Back Home</Link>
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
