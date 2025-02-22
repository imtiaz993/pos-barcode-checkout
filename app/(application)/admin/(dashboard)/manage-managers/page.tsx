"use client";

import Loader from "@/components/loader";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateManager from "./components/CreateManager";
import { toast } from "sonner";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaSignInAlt,
  FaPlus,
  FaUserTie,
} from "react-icons/fa";

const Page = () => {
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/firebase/getManagers");
      setManagers(data.managers);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch managers");
      console.error("Error fetching managers:", error);
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
        <CreateManager setShowPopup={setShowPopup} fetchUsers={fetchUsers} />
      )}
      <div className="min-h-[calc(100dvh-60px-16px)] mx-auto px-2 sm:px-4 py-4">
        <div className="w-full mx-auto mt-3 sm:mt-4 flex flex-col min-h-[calc(100dvh-82px)]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-700 flex items-center gap-2">
              <FaUserTie /> All Managers
            </h1>
            <button
              onClick={() => setShowPopup(true)}
              className="text-sm bg-blue-600 text-white py-2 px-4 flex items-center gap-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FaPlus /> Add Manager
            </button>
          </div>

          {/* Table */}
          <div className="bg-white shadow-lg rounded-lg flex-grow flex flex-col overflow-hidden">
            <div className="overflow-auto flex-grow">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead className="sticky top-0 bg-gray-100">
                  <tr className="text-gray-700">
                    <th className="p-2 sm:p-4">
                      <span className="flex items-center gap-2">
                        <FaUserTie className="text-gray-600" /> UID
                      </span>
                    </th>
                    <th className="p-2 sm:p-4">
                      <span className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-600" /> Email
                      </span>
                    </th>
                    <th className="p-2 sm:p-4">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-600" /> Created
                      </span>
                    </th>
                    <th className="p-2 sm:p-4 whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <FaSignInAlt className="text-gray-600" /> Last Logged In
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-base">
                  {managers.length > 0 ? (
                    managers.map((manager, index) => (
                      <tr
                        key={index}
                        className={`border-b transition ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } `}
                      >
                        <td className="p-2 sm:p-4 whitespace-nowrap">
                          {manager.uid}
                        </td>
                        <td className="p-2 sm:p-4 whitespace-nowrap">
                          {manager.email}
                        </td>
                        <td className="p-2 sm:p-4 whitespace-nowrap">
                          {new Date(
                            manager.metadata.creationTime
                          ).toLocaleString("en-US", {
                            timeZone: "UTC",
                          })}
                        </td>
                        <td className="p-2 sm:p-4 whitespace-nowrap">
                          {new Date(
                            manager.metadata.lastSignInTime
                          ).toLocaleString("en-US", {
                            timeZone: "UTC",
                          })}
                        </td>
                      </tr>
                    ))
                  ) : !loading ? (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-gray-500">
                        No managers found
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
