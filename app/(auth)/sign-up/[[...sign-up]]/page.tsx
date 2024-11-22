"use client";
import { useRouter } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import config from "@/config";

export default function SignUpPage() {
  const router = useRouter();

  if (!config?.auth?.enabled) {
    router.back();
  }

  return (
    <div className="flex min-w-screen justify-center my-[5rem]">
      <SignUp fallbackRedirectUrl="/" signInFallbackRedirectUrl="/" />
    </div>
  );
}
