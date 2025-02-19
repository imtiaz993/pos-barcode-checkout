"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaShoppingCart, FaGift, FaHandsHelping } from "react-icons/fa";

const Page = () => {
  const { region, storeId }: any = useParams();

  const options = [
    {
      href: `/checkout/${region}/${storeId}`,
      icon: <FaShoppingCart className="text-blue-600 text-2xl" />,
      title: "Checkout",
      description: "Complete your purchase with ease.",
    },
    {
      href: `/giftcard/${region}/${storeId}`,
      icon: <FaGift className="text-blue-600 text-2xl" />,
      title: "Gift Card",
      description: "Buy a special gift for your loved ones.",
    },
    {
      href: `/assistance?mode=chats&type=&region=${region}&storeId=${storeId}`,
      icon: <FaHandsHelping className="text-blue-600 text-2xl" />,
      title: "Assistance",
      description: "Get help and support for your needs.",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-41px-16px-32px)]">
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
        <div className="grid gap-3">
          {options.map((option, index) => (
            <Link key={index} href={option.href} className="block">
              <div className="flex items-center gap-6 py-2 px-4 border rounded-lg shadow-sm bg-gray-50">
                {option.icon}
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {option.title}
                  </h3>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
