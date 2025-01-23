"use client";

import Loader from "@/components/loader";
import { useEffect, useState } from "react";

const Page = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/getAdmins");
      const data = await response.json();

      if (response.ok) {
        setAdmins(data.admins);
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
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Admins</h1>
      {loading ? (
        <Loader />
      ) : admins.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <ul className="divide-y divide-gray-300">
            {admins.map((admin) => (
              <li key={admin.uid} className="py-2">
                <p className="text-gray-600">{admin.email}</p>
                <p className="text-gray-500">UID: {admin.uid}</p>
                <p className="text-gray-500">
                  Admin Created:{" "}
                  {new Date(admin.metadata.creationTime).toLocaleString(
                    "en-US",
                    {
                      timeZone: "UTC",
                    }
                  )}
                </p>
                <p className="text-gray-500">
                  Last Login:{" "}
                  {new Date(admin.metadata.lastSignInTime).toLocaleString(
                    "en-US",
                    {
                      timeZone: "UTC",
                    }
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Page;
