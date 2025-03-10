"use client";

import Loader from "@/components/loader";
import { useEffect, useState } from "react";

const Page = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/getUsers");
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        console.error("Failed to fetch users:", data.error);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
      <div className="min-h-[calc(100dvh-60px-16px)] mx-auto px-2 sm:px-4 py-2">
        <div className="w-full mx-auto mt-3 sm:mt-4 flex flex-col min-h-[calc(100dvh-82px)]">
          <h1 className="mb-3 sm:mb-5 text-lg sm:text-2xl font-semibold text-gray-700">
            All Users
          </h1>
          <div className="bg-white shadow-lg rounded-lg flex-grow flex flex-col overflow-hidden">
            <div className="overflow-auto flex-grow">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="p-2 sm:p-4">UID</th>
                    <th className="p-2 sm:p-4">Phone</th>
                    <th className="p-2 sm:p-4">Created</th>
                    <th className="p-2 sm:p-4 whitespace-nowrap">
                      Last LoggedIn
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-base">
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr
                        key={index}
                        className={`border-b ${
                          index % 2 == 0 ? "" : "bg-gray-50"
                        }`}
                      >
                        <td className="p-2 sm:p-4 whitespace-nowrap">
                          {" "}
                          {user.uid}
                        </td>
                        <td className="p-2 sm:p-4 whitespace-nowrap">
                          {user.phoneNumber}
                        </td>
                        <td className="p-2 sm:p-4 whitespace-nowrap">
                          {new Date(user.metadata.creationTime).toLocaleString(
                            "en-US",
                            {
                              timeZone: "UTC",
                            }
                          )}
                        </td>
                        <td className="p-2 sm:p-4 whitespace-nowrap">
                          {new Date(
                            user.metadata.lastSignInTime
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
