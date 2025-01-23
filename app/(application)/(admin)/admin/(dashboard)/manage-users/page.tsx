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
      <div className="w-full mx-auto mt-4 flex flex-col min-h-[calc(100dvh-210px)]  sm:min-h-[calc(100dvh-180px)]">
        <div className="bg-white shadow-lg rounded-lg flex-grow flex flex-col">
          <div className="overflow-auto flex-grow">
            <table className="w-full text-left border-collapse text-sm sm:text-base">
              <thead className="sticky top-0 bg-gray-100 shadow-md">
                <tr>
                  <th className="p-2 sm:p-4">UID</th>
                  <th className="p-2 sm:p-4">Phone</th>
                  <th className="p-2 sm:p-4 whitespace-nowrap">Created</th>
                  <th className="p-2 sm:p-4">Last LoggedIn</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-base">
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr
                      key={index}
                      className={`border-b ${
                        index % 2 == 0 ? "" : "bg-gray-100"
                      }`}
                    >
                      <td className="p-2 sm:p-4"> {user.uid}</td>
                      <td className="p-2 sm:p-4">{user.phoneNumber}</td>
                      <td className="p-2 sm:p-4">
                        {new Date(user.metadata.creationTime).toLocaleString(
                          "en-US",
                          {
                            timeZone: "UTC",
                          }
                        )}
                      </td>
                      <td className="p-2 sm:p-4">
                        {new Date(user.metadata.lastSignInTime).toLocaleString(
                          "en-US",
                          {
                            timeZone: "UTC",
                          }
                        )}
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
    </>
  );
};

export default Page;
