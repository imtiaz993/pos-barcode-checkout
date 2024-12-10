"use client"

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const Page = () => {
  const { region, storeId }: any = useParams();
  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="rounded-lg p-6 pt-0 w-full max-w-lg">
        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            width={0}
            height={0}
            sizes="100vw"
            alt=""
            className="w-auto"
          />
        </div>
        <Link href={`/checkout/${region}/${storeId}`}>
          <button className="w-full bg-blue-600 text-white py-2 text-sm rounded-lg mb-2">
            Go to Checkout
          </button>
        </Link>
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
