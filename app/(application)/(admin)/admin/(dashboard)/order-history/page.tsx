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

  // Orders data
  const [orders, setOrders] = useState<any[]>([]);
  // For server-side pagination (total number of orders)
  const [totalRecords, setTotalRecords] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterMode, setFilterMode] = useState(false);

  // Filters
  const [storeId, setStoreId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  // Note: ReactPaginate uses zero-based pages, but your API might be 1-based.
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  /**
   * Fetch all orders (unfiltered).
   */
  const fetchAllOrders = async (page = 0, limit = 10) => {
    try {
      setLoading(true);

      // If API is 1-based, convert `page` to `page + 1`:
      const response = await axios.get(
        "https://www.adminapi.ecoboutiquemarket.com/orders/all",
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
          params: {
            page: page + 1, // if needed
            page_size: limit,
          },
        }
      );

      // Adjust this according to your response structure
      // Example response: { orders: [...], totalRecords: 150 }
      setOrders(response.data.orders);
      setTotalRecords(response.data.totalRecords);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching data");
      setLoading(false);
    }
  };

  /**
   * Fetch filtered orders.
   */
  const fetchFilteredOrders = async (page = 0, limit = 10) => {
    try {
      setLoading(true);

      // If your API for filter is a POST, use axios.post.
      // If it's GET, adapt accordingly. Example with POST:
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
            page: page + 1, // if needed
            page_size: limit,
          },
        }
      );

      // Adjust to match server response
      setOrders(response.data.orders);
      setTotalRecords(response.data.totalRecords);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching data");
      setLoading(false);
    }
  };

  /**
   * Applies filters:
   * - Enables filter mode
   * - Resets page to 0
   * - Calls fetchFilteredOrders
   */
  const applyFilter = () => {
    setFilterMode(true);
    setCurrentPage(0);
    fetchFilteredOrders(0, pageSize);
  };

  /**
   * Clears filters (optional function).
   * - Disables filter mode
   * - Resets filter fields
   * - Resets pagination to page 0
   * - Fetches all orders again
   */
  const clearFilter = () => {
    setFilterMode(false);
    setStoreId("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(0);
    fetchAllOrders(0, pageSize);
  };

  /**
   * Initial fetch on mount (unfiltered).
   * We do this once.
   * After that, page changes or filter changes will be handled manually.
   */
  useEffect(() => {
    fetchAllOrders(0, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate total pages for ReactPaginate
  const pageCount = Math.ceil(totalRecords / pageSize);

  /**
   * Handle page change from ReactPaginate
   */
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
    if (filterMode) {
      fetchFilteredOrders(selectedItem.selected, pageSize);
    } else {
      fetchAllOrders(selectedItem.selected, pageSize);
    }
  };

  /**
   * Handle page size change
   */
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0);

    // Re-fetch from first page with new page size
    if (filterMode) {
      fetchFilteredOrders(0, newSize);
    } else {
      fetchAllOrders(0, newSize);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-[calc(100dvh-60px-16px)] mx-auto px-4 py-2 max-w-md">
        <div className="max-w-md">
          {/* Toggle Filters Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="flex items-center gap-2 text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              {filtersVisible ? (
                <>
                  <IoMdClose className="text-lg" />
                  <span>Close Filters</span>
                </>
              ) : (
                <>
                  <IoMdFunnel className="text-lg" />
                  <span>Show Filters</span>
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
                <div className="flex gap-2">
                  <button
                    onClick={applyFilter}
                    className="text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    Apply Filters
                  </button>

                  {/* Clear Filters Button (optional) */}
                  {filterMode && (
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
          )}

          {/* Pagination Controls (Page Size) */}
          <div className="flex items-center justify-between mt-4 mb-2">
            <span className="text-sm">Page Size:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border px-2 py-1 rounded-lg"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* React Paginate Component */}
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            // Keep the paginator's displayed page in sync with currentPage
            forcePage={currentPage}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />

          {/* Order Table */}
          <div className="w-full max-w-md mx-auto mt-4">
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
                  {orders && orders.length > 0 ? (
                    orders.map((item: any, index: number) => (
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
                        <td className="p-2">
                          ${item.totalAmount?.toFixed(2) ?? "0.00"}
                        </td>
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

          {/* React Paginate at bottom (optional) */}
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            forcePage={currentPage}
            onPageChange={handlePageChange}
            containerClassName={"pagination mt-4"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
