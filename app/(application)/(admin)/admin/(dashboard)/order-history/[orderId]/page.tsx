"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/loader";
import { toast } from "sonner";
import {
  FaStore,
  FaRegCalendarAlt,
  FaDollarSign,
  FaTag,
  FaGift,
  FaShoppingCart,
} from "react-icons/fa";
import { getUserToken } from "@/lib/auth";

const OrderDetail = () => {
  const token = getUserToken();

  const { orderId } = useParams();
  const router = useRouter();

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://www.adminapi.ecoboutiquemarket.com/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrderDetails(res.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.message || "Failed to fetch order details"
        );
        setLoading(false);
        console.error("Error fetching order details:", error);
      });
  }, [orderId]);

  if (loading) {
    return <Loader />;
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-50px)] px-4 py-4 bg-gray-50 sm:pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
          >
            &larr; Back
          </button>
          <h1 className="sm:text-xl font-bold text-gray-800">Order Details</h1>
          <div></div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="px-4 py-2 sm:p-4 border rounded-lg flex items-center gap-4 bg-blue-50">
              <FaRegCalendarAlt className="text-blue-600 text-xl sm:text-3xl" />
              <div>
                <p className="text-sm font-medium text-gray-600">Order Date</p>
                <p className="sm:text-lg font-medium sm:font-semibold text-gray-800">
                  {new Date(orderDetails?.orderDate).toLocaleString("en-US", {
                    timeZone: "UTC",
                  })}
                </p>
              </div>
            </div>

            <div className="px-4 py-2 sm:p-4 border rounded-lg flex items-center gap-4 bg-green-50">
              <FaStore className="text-green-600 text-3xl" />
              <div>
                <p className="text-sm font-medium text-gray-600">Store ID</p>
                <p className="sm:text-lg font-medium sm:font-semibold text-gray-800">
                  {orderDetails?.storeId}
                </p>
              </div>
            </div>

            <div className="px-4 py-2 sm:p-4 border rounded-lg flex items-center gap-4 bg-yellow-50">
              <FaDollarSign className="text-yellow-600 text-3xl" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Amount
                </p>
                <p className="sm:text-lg font-medium sm:font-semibold text-gray-800">
                  ${orderDetails?.totalAmount?.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="px-4 py-2 sm:p-4 border rounded-lg flex items-center gap-4 bg-red-50">
              <FaTag className="text-red-600 text-3xl" />
              <div>
                <p className="text-sm font-medium text-gray-600">Coupon Code</p>
                <p className="sm:text-lg font-medium sm:font-semibold text-gray-800">
                  {orderDetails?.couponId || "N/A"}
                </p>
              </div>
            </div>

            <div className="px-4 py-2 sm:p-4 border rounded-lg flex items-center gap-4 bg-purple-50">
              <FaGift className="text-purple-600 text-3xl" />
              <div>
                <p className="text-sm font-medium text-gray-600">Gift Card</p>
                <p className="sm:text-lg font-medium sm:font-semibold text-gray-800">
                  {orderDetails?.giftCardCode || "N/A"}
                </p>
              </div>
            </div>

            {/* New Phone Number Card */}
            <div className="px-4 py-2 sm:p-4 border rounded-lg flex items-center gap-4 bg-indigo-50">
              <FaShoppingCart className="text-indigo-600 text-3xl" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Phone Number
                </p>
                <p className="sm:text-lg font-medium sm:font-semibold text-gray-800">
                  {orderDetails?.userPhone || "Not Provided"}
                </p>
              </div>
            </div>
          </div>

          <h2 className="sm:text-xl font-semibold text-gray-800 mt-8 flex items-center gap-2">
            <FaShoppingCart className="text-gray-600" />
            Order Items
          </h2>
          <div className="mt-4 bg-gray-100 px-4 py-2 sm:p-4 rounded-lg">
            {orderDetails.orderItems.map((item: any, index: number) => (
              <div
                key={index}
                className="border-b border-gray-300 py-3 last:border-b-0"
              >
                <p className="text-gray-700">
                  <span className="font-medium">Product:</span>{" "}
                  {item?.productName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Quantity:</span>{" "}
                  {item?.quantity}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Price:</span> $
                  {item?.price?.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
