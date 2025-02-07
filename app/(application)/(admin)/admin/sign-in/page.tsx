"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { checkAuthState } from "@/utils/firebaseAuth";

const EmailAuthentication = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [checkingAuth, setCheckingAuth] = useState(true);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const data: any = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        try {
          const response: any = await fetch("/api/set-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: data.user.uid }),
          });

          const res = await response.json();
          if (response.ok) {
            console.log(res.message);
          } else {
            console.error(res.error);
          }
          await data.user.getIdToken(true); // Refresh token

          // Get updated user claims
          const tokenResult = await data.user.getIdTokenResult();
          const claims = tokenResult.claims;
          if (claims.admin) {
            localStorage.setItem("user", JSON.stringify(data.user));
            router.replace("/admin/order-history");
          }
        } catch (error) {
          console.error("Error calling API:", error);
        }
      } catch (error) {
        formik.setFieldError("email", "Invalid email or password");
        console.error("Error during signInWithEmailAndPassword", error);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const handleAuth = async () => {
      const isLoggedIn = await checkAuthState();
      if (user && isLoggedIn) {
        const token = await user.getIdTokenResult();
        if (token.claims.admin) {
          router.replace("/admin/order-history");
        }
        return;
      }
      setCheckingAuth(false);
    };

    handleAuth();
  }, [user]);

  if (checkingAuth) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="rounded-lg shadow-sm border p-6 pt-0 w-full max-w-md mx-auto">
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
        <h1 className="text-2xl font-bold text-center">
          Welcome! Let&apos;s Get Started
        </h1>
        <p className="text-[#71717a] text-sm text-center mt-2">
          Enter your email and password to sign in.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-6">
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`block w-full px-3 py-2 border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg shadow-sm text-sm focus:outline-none`}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-2">{formik.errors.email}</p>
          )}

          <label htmlFor="password" className="block text-sm font-medium mt-4">
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`block w-full px-3 py-2 border ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg shadow-sm text-sm focus:outline-none`}
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-2">
              {formik.errors.password}
            </p>
          )}

          <button
            type="submit"
            className={`mt-6 w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailAuthentication;
