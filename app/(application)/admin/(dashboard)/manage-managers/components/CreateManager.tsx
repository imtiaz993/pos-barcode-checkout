import { db } from "@/app/firebase";
import axios from "axios";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useFormik } from "formik";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "sonner";
import * as Yup from "yup";

const CreateManager = ({ setShowPopup, fetchUsers }: any) => {
  const [mode, setMode] = useState("sso");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password:
        mode == "sso"
          ? Yup.string()
          : Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (mode === "sso") {
          const userRef = doc(db, "sso-allowed-users", values.email);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, { email: values.email });
            setShowPopup(false);
            toast.success("Manager added successfully!");
          } else {
            toast.error("Manager already exists!");
          }
        } else {
          const { data } = await axios.post("/api/firebase/create-user", {
            email: values.email,
            password: values.password,
          });

          await axios.post("/api/firebase/set-manager", {
            uid: data.data.uid,
          });

          setShowPopup(false);
          fetchUsers();
          toast.success("Manager added successfully!");
        }
      } catch (error: any) {
        console.log("Error during signInWithEmailAndPassword", error);
        toast.error(error.response.data.error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <div>
      {" "}
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
        <div className="bg-white border px-5 py-5 rounded-lg w-11/12 lg:w-1/3 transform transition-all min-w-96 max-w-lg sm:shadow-xl">
          <div className="flex justify-between mb-2">
            <h2 className="text-lg font-semibold">Create New Manager</h2>
            <button
              disabled={formik.isSubmitting}
              onClick={() => setShowPopup(false)}
            >
              <IoMdClose className="text-lg cursor-pointer" />
            </button>
          </div>

          <div className="space-y-4 mt-4">
            <div className="m-1 mb-2 grid grid-cols-2 relative  bg-gray-200 rounded overflow-hidden">
              {/* Animated Background */}
              <div
                className={`absolute top-0 bottom-0 w-1/2 bg-blue-600 transition-all duration-300 ${
                  mode === "password" ? "translate-x-full" : "translate-x-0"
                }`}
              ></div>

              <div
                onClick={() => {
                  setMode("sso");
                }}
                className="relative px-4 md:px-2 py-1.5 cursor-pointer text-sm font-medium text-gray-700 transition-colors duration-300"
              >
                <span
                  className={`${
                    mode === "sso" ? "text-white" : "text-gray-700"
                  } flex-1 flex items-center justify-center gap-1.5   z-10`}
                >
                  SSO
                </span>
              </div>

              <div
                onClick={() => {
                  setMode("password");
                }}
                className="relative px-4 md:px-2 py-1.5 cursor-pointer text-sm font-medium text-gray-700 transition-colors duration-300"
              >
                <span
                  className={`${
                    mode === "password" ? "text-white" : "text-gray-700"
                  } flex-1 flex items-center justify-center gap-1.5  z-10`}
                >
                  Email/Password
                </span>
              </div>
            </div>
            <div>
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
                  <p className="text-red-500 text-sm mt-2">
                    {formik.errors.email}
                  </p>
                )}

                {mode == "password" && (
                  <>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium mt-4"
                    >
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
                  </>
                )}

                <button
                  type="submit"
                  className={`mt-6 w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition ${
                    formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Creating ..." : "Create"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateManager;
