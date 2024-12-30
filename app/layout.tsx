import { Toaster } from "@/components/sonner";
import Script from "next/script";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://starter.rasmic.xyz"),
  title: {
    default: "Eco Boutique",
    template: `%s | Eco Boutique`,
  },
  description: "Convenience at Your Doorstep, Luxury in Every Detail.",
  openGraph: {
    description: "Convenience at Your Doorstep, Luxury in Every Detail.",
    images: ["/images/APP ICON.png"],
    url: "https://starter.rasmic.xyz/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eco Boutique",
    description: "Convenience at Your Doorstep, Luxury in Every Detail.",
    siteId: "",
    creator: "@rasmic",
    creatorId: "",
    images: ["/images/APP ICON.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        ></meta>
        <Script
          src="https://tools.luckyorange.com/core/lo.js?site-id=4e0fd289"
          strategy="lazyOnload"
          async
          defer
        />
      </head>
      <body className="max-w-md mx-auto pb-4">
        <Suspense>{children}</Suspense>
        <Toaster />
      </body>
    </html>
  );
}
