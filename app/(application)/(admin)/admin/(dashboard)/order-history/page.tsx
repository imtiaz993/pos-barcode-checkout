"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
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
  const filterRef = useRef<HTMLDivElement | null>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterMode, setFilterMode] = useState(false);

  const [storeId, setStoreId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderType, setOrderType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAllOrders = async (page = 1, limit = 10, type = "all") => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://www.adminapi.ecoboutiquemarket.com/orders/all",
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
          params: {
            page: page,
            page_size: limit,
            order_type: type !== "all" ? type : undefined,
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

  const fetchFilteredOrders = async (page = 1, limit = 10, type = "all") => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://www.adminapi.ecoboutiquemarket.com/orders/filter_orders",
        {
          store_id: storeId,
          start_date: startDate,
          end_date: endDate,
          order_type: type !== "all" ? type : undefined,
        },
        {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
          params: { page, page_size: limit },
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

  const applyFilter = () => {
    if (storeId || startDate || endDate) {
      setFilterMode(true);
      setCurrentPage(1);
      fetchFilteredOrders(1, pageSize, orderType);
      setFiltersVisible(false);
    }
  };

  const clearFilter = () => {
    setFilterMode(false);
    setStoreId("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    fetchAllOrders(1, pageSize, orderType);
    setFiltersVisible(false);
  };

  useEffect(() => {
    fetchAllOrders(1, pageSize, orderType);
  }, [orderType]);

  /**
   * Handle page change from ReactPaginate
   */
  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
    if (filterMode) {
      fetchFilteredOrders(selected, pageSize, orderType);
    } else {
      fetchAllOrders(selected, pageSize, orderType);
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
      fetchFilteredOrders(1, newSize, orderType);
    } else {
      fetchAllOrders(1, newSize, orderType);
    }
  };

  /**
   * Close filters when clicking outside, but only on desktop screens.
   */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        if (window.innerWidth >= 640) {
          setFiltersVisible(false);
        }
      }
    };

    if (filtersVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filtersVisible]);

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-[calc(100dvh-60px-16px)] mx-auto px-2 sm:px-4 py-2">
        <div className="">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2">
              <label htmlFor="orderType" className="text-sm font-medium">
                Order Type:
              </label>
              <select
                id="orderType"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="border px-3 py-2 rounded-lg text-sm"
              >
                <option value="all">All</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div ref={filterRef} className="relative">
              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="flex items-center gap-2 text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                <IoMdFunnel className="text-lg" />
                Filters
              </button>

              {filtersVisible && (
                <div className="fixed sm:absolute sm:right-0 sm:top-9 inset-0 sm:inset-auto z-[120] flex items-center justify-center bg-[rgba(0,0,0,0.8)] sm:bg-transparent">
                  <div className="bg-white border px-5 py-5 rounded-lg w-11/12 sm:w-1/2 lg:w-1/3 transform transition-all min-w-96 max-w-lg sm:shadow-xl">
                    <div className="flex justify-between mb-2">
                      <h2 className="text-lg font-semibold">Filters</h2>
                      <button
                        onClick={() => setFiltersVisible(false)}
                        className="text-red-500 hover:text-red-700 sm:hidden"
                      >
                        <IoMdClose className="text-lg" />
                      </button>
                    </div>

                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium">
                          Store ID
                        </label>
                        <select
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

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      {filterMode && (storeId || startDate || endDate) && (
                        <button
                          onClick={clearFilter}
                          className="text-sm bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        onClick={applyFilter}
                        className="text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full mx-auto mt-4 flex flex-col min-h-[calc(100dvh-210px)]  sm:min-h-[calc(100dvh-180px)]">
            <div className="bg-white shadow-lg rounded-lg flex-grow flex flex-col overflow-hidden">
              <div className="overflow-auto flex-grow">
                <table className="w-full text-left border-collapse text-sm sm:text-base">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr>
                      <th className="p-2 sm:p-4">Date</th>
                      <th className="p-2 sm:p-4">Store</th>
                      <th className="p-2 sm:p-4 whitespace-nowrap">
                        Sub Total
                      </th>
                      <th className="p-2 sm:p-4">Tax</th>
                      <th className="p-2 sm:p-4">Total</th>
                      <th className="p-2 sm:p-4">Coupon</th>
                      <th className="p-2 sm:p-4">Status</th>
                      <th className="p-2 sm:p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-base">
                    {orders.length > 0 ? (
                      orders.map((order, index) => (
                        <tr
                          key={index}
                          className={`border-b ${
                            index % 2 == 0 ? "" : "bg-gray-50"
                          }`}
                        >
                          <td className="p-2 sm:p-4 whitespace-nowrap">
                            {" "}
                            {new Date(order.orderDate).toLocaleString("en-US", {
                              timeZone: "UTC",
                            })}
                          </td>
                          <td className="p-2 sm:p-4 whitespace-nowrap">
                            {order.storeId}
                          </td>
                          <td className="p-2 sm:p-4 whitespace-nowrap">
                            ${order?.subTotal?.toFixed(2)}
                          </td>
                          <td className="p-2 sm:p-4 whitespace-nowrap">
                            ${order?.tax?.toFixed(2)}
                          </td>
                          <td className="p-2 sm:p-4 whitespace-nowrap">
                            ${order?.totalAmount?.toFixed(2)}
                          </td>
                          <td className="p-2 sm:p-4 whitespace-nowrap">
                            {order.couponId || "N/A"}
                          </td>
                          <td className="p-2 sm:p-4 whitespace-nowrap capitalize">
                            {order.status}
                          </td>
                          <td className="p-2 sm:p-4 whitespace-nowrap">
                            <Link
                              href={`/admin/order-history/${order.orderId}`}
                            >
                              <button className="text-blue-600 hover:text-blue-800">
                                View
                              </button>
                            </Link>
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

          <div className="px-2 sm:px-0 sm:flex flex-row-reverse justify-between items-center mt-4">
            <div className="flex items-center justify-between mb-4 sm:mb-0">
              <div className="text-sm sm:text-base text-gray-600 sm:hidden">
                Showing{" "}
                {totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, totalRecords)} of{" "}
                {totalRecords}
              </div>
              <div className="flex justify-end sm:justify-start items-center">
                <label className="text-sm">Page Size:</label>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="ml-2 border px-2 py-1 rounded-lg"
                >
                  {[10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={pageSize}
              totalItemsCount={totalRecords}
              onChange={handlePageChange}
              innerClass="flex gap-1 sm:gap-2 flex-wrap items-center justify-between sm:justify-start"
              itemClass="px-2.5 sm:px-3 py-0.5 sm:py-1 border rounded-md text-sm hover:bg-gray-100"
              activeClass="bg-blue-600 text-white hover:!bg-blue-600"
              disabledClass="opacity-50 cursor-not-allowed"
            />
            <div className="text-sm sm:text-base text-gray-600 hidden sm:block">
              Showing{" "}
              {totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
