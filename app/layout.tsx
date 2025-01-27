import { Toaster } from "@/components/sonner";
import Script from "next/script";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.ecoboutiquemarket.com/"),
  title: {
    default: "Eco Boutique",
    template: `%s | Eco Boutique`,
  },
  description: "Convenience at Your Doorstep, Luxury in Every Detail.",
  openGraph: {
    description: "Convenience at Your Doorstep, Luxury in Every Detail.",
    images: ["/images/APP ICON.png"],
    url: "https://app.ecoboutiquemarket.com/",
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
        <meta http-equiv="refresh" content="0; url=https://dev-eco-boutique.vercel.app/activate-gift-card"></meta>
      </head>
      <body className="mx-auto">
        <Suspense>{children}</Suspense>
        <Toaster />
      </body>
    </html>
  );
}
