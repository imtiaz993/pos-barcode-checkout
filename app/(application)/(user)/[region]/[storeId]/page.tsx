"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const Page = () => {
  const { region, storeId }: any = useParams();
  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-41px-16px)]">
      <div className="rounded-lg p-6 pt-0 w-full max-w-md mx-auto">
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
        <div className="mb-4">
          <Link href={`/checkout/${region}/${storeId}`}>
            <button className="w-full bg-blue-600 text-white py-2 text-sm rounded-lg">
              Go to Checkout
            </button>
          </Link>
        </div>
        <Link href={`/giftcard/${region}/${storeId}`}>
          <button className="w-full bg-blue-600 text-white py-2 text-sm rounded-lg">
            Purchase Gift Card
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
