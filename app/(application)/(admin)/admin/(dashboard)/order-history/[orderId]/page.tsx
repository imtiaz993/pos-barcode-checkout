"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/loader";
import { toast } from "sonner";

const OrderDetail = () => {
  const { orderId } = useParams();
  const router = useRouter();

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post("https://api.ecoboutiquemarket.com/order/detail", {
        order_id: orderId,
      })
      .then((res) => {
        setOrderDetails(res.data.order);
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
      <div className="min-h-[calc(100dvh-41px-16px)] flex items-center justify-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-41px-16px)] mx-auto px-4 py-2 max-w-md">
      <div className="max-w-md">
        <div className="flex justify-between mb-4">
          <p
            className="cursor-pointer text-blue-500"
            onClick={() => router.back()}
          >
            &larr; Back
          </p>
        </div>

        <h1 className="text-lg font-bold">Order Details</h1>

        <div className="bg-white p-4 rounded-lg shadow mt-4">
          <p>
            <strong>Order ID:</strong> {orderDetails.orderId}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(orderDetails.orderDate).toLocaleString("en-US", {
              timeZone: "UTC",
            })}
          </p>
          <p>
            <strong>Status:</strong> {orderDetails.status}
          </p>
          <p>
            <strong>Store:</strong> {orderDetails.storeId}
          </p>
          <p>
            <strong>Total Amount:</strong> ${orderDetails.totalAmount}
          </p>
          <p>
            <strong>Coupon Code:</strong> {orderDetails.couponId || "N/A"}
          </p>
          <p>
            <strong>Gift Card:</strong> {orderDetails.giftCardCode || "N/A"}
          </p>

          <h2 className="text-lg font-semibold mt-4">Order Items</h2>
          <ul className="mt-2">
            {orderDetails.orderItems.map((item: any, index: number) => (
              <li
                key={index}
                className="border-b py-2 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Product ID:</strong> {item.productId}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Price:</strong> ${item.price}
                  </p>
                </div>
                <p>
                  <strong>Reward Points:</strong> {item.reward_point}
                </p>
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-semibold mt-4">Payment</h2>
          <p>
            <strong>Transaction ID:</strong> {orderDetails.terminalCheckout.id}
          </p>
          <p>
            <strong>Status:</strong> {orderDetails.terminalCheckout.status}
          </p>
          <p>
            <strong>Amount:</strong> $
            {orderDetails.terminalCheckout.amount / 100} (
            {orderDetails.terminalCheckout.currency.toUpperCase()})
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
