"use client";

import { useState } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../../../firebase";
import { useRouter } from "next/navigation";

const EmailAuthentication = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

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
        const data = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        localStorage.setItem("user", JSON.stringify(data.user));
        router.replace("/admin/manage-orders");
      } catch (error) {
        formik.setFieldError("email", "Invalid email or password");
        console.error("Error during signInWithEmailAndPassword", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="rounded-lg shadow-sm border p-6 pt-0 w-full max-w-md">
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
