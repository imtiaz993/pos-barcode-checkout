"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const PhoneNumberPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const phoneValidationSchema = Yup.object().shape({
    phone: Yup.string()
    .required("Phone number is required"),
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Mock API call
      const response = await axios.post("/api/phone", { phone: values.phone });
      console.log(response.data); // Log response for debugging
      router.push("/success"); // Route to success page
    } catch (error) {
      console.error("Error submitting phone number:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Welcome! Let's Get Started
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Enter your phone number to sign in or create an account.
        </p>

        <Formik
          initialValues={{ phone: "" }}
          validationSchema={phoneValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <Field
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className={`mt-6 w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition ${
                  isSubmitting || loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting || loading}
              >
                {loading ? "Submitting..." : "Continue"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-gray-600 text-center mt-4 text-sm">
          Don't have an account?{" "}
          <span className="text-blue-500 font-medium">
            No worries—we'll set one up for you automatically.
          </span>
        </p>
      </div>
    </div>
  );
};

export default PhoneNumberPage;
