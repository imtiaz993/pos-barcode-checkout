"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/loader";
import Link from "next/link";
import { IoMdClose, IoMdFunnel } from "react-icons/io";
import { getAuth } from "firebase/auth";
import { app } from "@/app/firebase";
import Pagination from "react-js-pagination";

const Page = () => {
  const auth = getAuth(app);
  const user: any = auth.currentUser;

  // Orders data
  const [orders, setOrders] = useState<any[]>([]);
  // For server-side pagination (total number of orders)
  const [totalRecords, setTotalRecords] = useState(0);

  // UI state
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterMode, setFilterMode] = useState(false);

  // Filters
  const [storeId, setStoreId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /**
   * Fetch all orders (unfiltered).
   */
  const fetchAllOrders = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://www.adminapi.ecoboutiquemarket.com/orders/all",
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
          params: {
            page: page, // if needed
            page_size: limit,
          },
        }
      );

      setOrders(response.data.orders);
      setTotalRecords(response.data.total_count);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch filtered orders.
   */
  const fetchFilteredOrders = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://www.adminapi.ecoboutiquemarket.com/orders/filter_orders",
        {
          store_id: storeId,
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
          params: {
            page: page,
            page_size: limit,
          },
        }
      );

      setOrders(response.data.orders);
      setTotalRecords(response.data.total_count);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Applies filters:
   * - Enables filter mode
   * - Resets page to 1
   * - Calls fetchFilteredOrders
   */
  const applyFilter = () => {
    if (storeId || startDate || endDate) {
      setFilterMode(true);
      setCurrentPage(1);
      fetchFilteredOrders(1, pageSize);
      setFiltersVisible(false); // close the popup on apply
    }
  };

  /**
   * Clears filters (optional function).
   * - Disables filter mode
   * - Resets filter fields
   * - Resets pagination to page 1
   * - Fetches all orders again
   */
  const clearFilter = () => {
    setFilterMode(false);
    setStoreId("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    fetchAllOrders(1, pageSize);
    setFiltersVisible(false); // close the popup on clear
  };

  /**
   * Initial fetch on mount (unfiltered).
   */
  useEffect(() => {
    fetchAllOrders(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handle page change from ReactPaginate
   */
  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
    if (filterMode) {
      fetchFilteredOrders(selected, pageSize);
    } else {
      fetchAllOrders(selected, pageSize);
    }
  };

  /**
   * Handle page size change
   */
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);

    // Re-fetch from first page with new page size
    if (filterMode) {
      fetchFilteredOrders(1, newSize);
    } else {
      fetchAllOrders(1, newSize);
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-[calc(100dvh-60px-16px)] mx-auto sm:px-4 py-2">
        <div className="">
          <div className="flex items-center flex-row-reverse justify-between px-4 sm:px-0">
            {/* Toggle Filters Button */}
            <div className="flex justify-end relative">
              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="flex items-center gap-2 text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                <IoMdFunnel className="text-lg" />
              </button>
              {/* FILTERS POPUP MODAL */}
              {filtersVisible && (
                <div className="fixed sm:absolute sm:right-0 sm:top-9 inset-0 sm:inset-auto z-[120] flex items-center justify-center bg-[rgba(0,0,0,0.8)] sm:bg-transparent">
                  <div className="bg-white border px-5 pt-5 pb-10 rounded-lg w-11/12 sm:w-1/2 lg:w-1/3 transform transition-all min-w-96 max-w-lg sm:shadow-xl">
                    <div className="flex justify-between mb-2">
                      <p className="text-lg font-semibold">Filters</p>
                      <button
                        className="text-lg font-medium text-center sm:hidden"
                        onClick={() => setFiltersVisible(false)}
                      >
                        <IoMdClose />
                      </button>
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
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
                        <div className="flex-1 min-w-0">
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
                        <div className="flex-1 min-w-0">
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

                      {/* Action Buttons */}
                      <div className="flex flex-row-reverse gap-2 mt-4">
                        <button
                          onClick={applyFilter}
                          className="text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        >
                          Apply Filters
                        </button>

                        {/* Clear Filters Button (optional) */}
                        {filterMode && (storeId || startDate || endDate) && (
                          <button
                            onClick={clearFilter}
                            className="text-sm bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* END FILTERS POPUP MODAL */}
            </div>

            {/* Pagination Controls (Page Size) */}
            <div className="flex items-center">
              <span className="text-sm">Page Size:</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="border px-2 py-1 rounded-lg ml-2"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* React Paginate at bottom (optional) */}
          {/* <Pagination
            pageCount={pageCount}
            forcePage={currentPage}
            onPageChange={handlePageChange}
          /> */}
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={pageSize}
            totalItemsCount={totalRecords}
            pageRangeDisplayed={5}
            onChange={(pageNumber) => {
              handlePageChange(pageNumber);
            }}
            // Tailwind classes
            innerClass="px-4 sm:px-0 flex gap-1 sm:gap-2 mt-4 flex-wrap items-center justify-between sm:justify-start"
            itemClass="px-2.5 sm:px-3 py-0.5 sm:py-1 border rounded-md text-sm hover:bg-gray-100"
            activeClass="bg-blue-600 text-white hover:!bg-blue-600"
            disabledClass="opacity-50 cursor-not-allowed"
          />

          {/* Order Table */}
          <div className="w-full mx-auto mt-4">
            <div className="bg-white shadow-2xl rounded-lg sm:py-2overflow-hidden">
              <div className="max-h-[calc(100dvh-180px)] overflow-y-auto">
                <table className="w-full text-left border-collapse text-sm sm:text-base">
                  <thead className="sticky top-0 bg-white shadow-md">
                    <tr className="">
                      <th className="p-2 sm:p-4 text-gray-700">Date</th>
                      <th className="p-2 sm:p-4 text-gray-700">Store</th>
                      <th className="p-2 sm:p-4 text-gray-700 whitespace-nowrap">
                        Sub Total
                      </th>
                      <th className="p-2 sm:p-4 text-gray-700">Tax</th>
                      <th className="p-2 sm:p-4 text-gray-700">Total</th>
                      <th className="p-2 sm:p-4 text-gray-700">Coupon</th>
                      <th className="p-2 sm:p-4 text-gray-700">Status</th>
                      <th className="p-2 sm:p-4 text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm">
                    {orders && orders.length > 0 ? (
                      orders.map((item: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 sm:p-4">
                            {new Date(item.orderDate).toLocaleString("en-US", {
                              timeZone: "UTC",
                            })}
                          </td>
                          <td className="p-2 sm:p-4">{item.storeId}</td>
                          <td className="p-2 sm:p-4 font-normal">
                            ${item.subTotal?.toFixed(2) ?? "0.00"}
                          </td>
                          <td className="p-2 sm:p-4 font-normal">
                            ${item.tax?.toFixed(2) ?? "0.00"}
                          </td>
                          <td className="p-2 sm:p-4 font-normal">
                            ${item.totalAmount?.toFixed(2) ?? "0.00"}
                          </td>
                          <td className="p-2 sm:p-4">
                            {item.couponId || "N/A"}
                          </td>
                          <td className="p-2 sm:p-4 capitalize">
                            {item.status}
                          </td>
                          <td className="p-2 sm:p-4">
                            <Link
                              href={`/admin/order-history/${item.orderId}`}
                              className="text-blue-600"
                            >
                              <button className="flex items-center gap-2 text-sm bg-blue-600 text-white py-1 sm:py-1.5 px-2 sm:px-4 rounded-lg hover:bg-blue-700 transition">
                                View
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : !loading ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="p-2 sm:p-4 text-center font-medium"
                        >
                          No History Found
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
