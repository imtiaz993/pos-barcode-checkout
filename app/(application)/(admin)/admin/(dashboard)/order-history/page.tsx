"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/loader";
import Link from "next/link";
import { IoMdClose, IoMdFunnel } from "react-icons/io";
import { getAuth } from "firebase/auth";
import { app } from "@/app/firebase";
import ReactPaginate from "react-paginate";

const Page = () => {
  const auth = getAuth(app);
  const user: any = auth.currentUser;

  const [history, setHistory] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const [storeId, setStoreId] = useState(""); // Filter for store ID
  const [startDate, setStartDate] = useState(""); // Filter for start date
  const [endDate, setEndDate] = useState(""); // Filter for end date
  const [filtersVisible, setFiltersVisible] = useState(false); // Toggle filter visibility

  const [currentPage, setCurrentPage] = useState(0); // Current page index
  const [pageSize, setPageSize] = useState(10); // Number of items per page

  const fetchHistory = () => {
    setLoading(true);

    axios
      .get("https://www.adminapi.ecoboutiquemarket.com/orders/all", {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Error fetching data");
        setLoading(false);
        console.error("Error fetching client secret:", error);
      });
  };

  const applyFilter = () => {
    setLoading(true);

    // Construct query parameters
    const params: any = {};
    if (storeId) params.store_id = storeId;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    axios
      .post(
        "https://www.adminapi.ecoboutiquemarket.com/orders/filter_orders",
        params,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      )
      .then((res) => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Error fetching data");
        setLoading(false);
        console.error("Error fetching client secret:", error);
      });
  };

  useEffect(() => {
    fetchHistory(); // Fetch history on component load
  }, []);

  // Calculate paginated data
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = history.slice(startIndex, endIndex);

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-[calc(100dvh-60px-16px)] mx-auto px-4 py-2 max-w-md">
        <div className="max-w-md">
          {/* Filter Toggle Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="flex items-center gap-2 text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              {filtersVisible ? (
                <>
                  <IoMdClose className="text-lg" />
                </>
              ) : (
                <>
                  <IoMdFunnel className="text-lg" />
                </>
              )}
            </button>
          </div>

          {/* Filter Section */}
          {filtersVisible && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-semibold mb-2">Filters</h3>
              <div className="flex flex-col gap-4">
                {/* Store ID Dropdown */}
                <div>
                  <label
                    htmlFor="storeId"
                    className="block text-sm font-medium"
                  >
                    Store ID
                  </label>
                  <select
                    id="storeId"
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg text-sm"
                  >
                    <option value="">All Stores</option>
                    <option value="110">110</option>
                    <option value="111">111</option>
                    <option value="112">112</option>
                  </select>
                </div>

                {/* Date Range */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Apply Filters Button */}
                <button
                  onClick={applyFilter}
                  className="text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm">Page Size:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border px-2 py-1 rounded-lg"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={Math.ceil(history.length / pageSize)}
            onPageChange={(selectedItem) =>
              setCurrentPage(selectedItem.selected)
            }
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
          {/* Order Table */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-black">
                    <th className="p-2 text-gray-700">Order</th>
                    <th className="p-2 text-gray-700">Date</th>
                    <th className="p-2 text-gray-700">Store</th>
                    <th className="p-2 text-gray-700">Amount</th>
                    <th className="p-2 text-gray-700">Coupon</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {paginatedData && paginatedData.length > 0 ? (
                    paginatedData.map((item: any, index: any) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          <Link
                            href={`/admin/order-history/${item.orderId}`}
                            className="text-blue-600"
                          >
                            {item.orderId}
                          </Link>
                        </td>
                        <td className="p-2">
                          {new Date(item.orderDate).toLocaleString("en-US", {
                            timeZone: "UTC",
                          })}
                        </td>
                        <td className="p-2">{item.storeId}</td>
                        <td className="p-2">${item.totalAmount.toFixed(2)}</td>
                        <td className="p-2">{item.couponId || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-2 text-center font-medium">
                        No History Found
                      </td>
                    </tr>
                  )}
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
