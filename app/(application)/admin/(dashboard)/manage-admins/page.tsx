"use client";

import Loader from "@/components/loader";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateAdmin from "./components/CreateAdmin";
import { toast } from "sonner";

const Page = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const fetchUsers = async () => {
    try {
      const data: any = await axios.get("/api/firebase/getAdmins");
      setAdmins(data.data.admins);
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.log("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      {loading && <Loader />}
      {showPopup && (
        <CreateAdmin setShowPopup={setShowPopup} fetchUsers={fetchUsers} />
      )}
      <div className="min-h-[calc(100dvh-60px-16px)] mx-auto px-2 sm:px-4 py-2">
        <div className="w-full mx-auto  mt-3 sm:mt-4 flex flex-col min-h-[calc(100dvh-82px)]">
          <div className="flex justify-between mb-3 sm:mb-5 ">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-700">
              All Admins
            </h1>
            <button
              onClick={() => {
                setShowPopup(true);
              }}
              className="text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Add Admin
            </button>
          </div>
          <div className="bg-white shadow-lg rounded-lg flex-grow flex flex-col overflow-hidden">
            <div className="overflow-auto flex-grow">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead className="sticky top-0 bg-gray-100 ">
                  <tr>
                    <th className="p-2 sm:p-4">UID</th>
                    <th className="p-2 sm:p-4">Email</th>
                    <th className="p-2 sm:p-4">Created</th>
                    <th className="p-2 sm:p-4 whitespace-nowrap">
                      Last LoggedIn
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-base">
                  {admins.length > 0 ? (
                    admins.map((admin, index) => (
                      <tr
                        key={index}
                        className={`border-b ${
                          index % 2 == 0 ? "" : "bg-gray-50"
                        }`}
                      >
                        <td className="p-2 sm:p-4 whitespace-nowrap">
                          {" "}
                          {admin.uid}
                        </td>
                        <td className="p-2 sm:p-4 whitespace-nowrap">
                          {admin.email}
                        </td>
                        <td className="p-2 sm:p-4 whitespace-nowrap">
                          {new Date(admin.metadata.creationTime).toLocaleString(
                            "en-US",
                            {
                              timeZone: "UTC",
                            }
                          )}
                        </td>
                        <td className="p-2 sm:p-4 whitespace-nowrap">
                          {new Date(
                            admin.metadata.lastSignInTime
                          ).toLocaleString("en-US", {
                            timeZone: "UTC",
                          })}
                        </td>
                      </tr>
                    ))
                  ) : !loading ? (
                    <tr>
                      <td colSpan={8} className="text-center p-2 sm:p-4">
                        No records found
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
