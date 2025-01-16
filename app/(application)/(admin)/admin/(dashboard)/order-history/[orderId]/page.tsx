"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/loader";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";
import { app } from "@/app/firebase";

const OrderDetail = () => {
  const auth = getAuth(app);
  const user: any = auth.currentUser;

  const { orderId } = useParams();
  const router = useRouter();

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://www.adminapi.ecoboutiquemarket.com/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`, // Include the token in the Authorization header
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
      <div className="min-h-[calc(100dvh-60px-16px)] flex items-center justify-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-41px-16px)] mx-auto px-4 py-2 max-w-md">
      <div className="max-w-md">
        <div className="flex justify-between mb-4">
          <p
            className="cursor-pointer text-blue-600"
            onClick={() => router.back()}
          >
            &larr; Back
          </p>
        </div>

        <h1 className="text-lg font-medium">Order Details</h1>

        <div className="bg-white p-4 rounded-lg shadow mt-4">
          <p>
            <span className="font-medium">Order ID:</span>{" "}
            {orderDetails?.orderId}
          </p>
          <p>
            <span className="font-medium">Date:</span>{" "}
            {new Date(orderDetails?.orderDate).toLocaleString("en-US", {
              timeZone: "UTC",
            })}
          </p>
          <p>
            <span className="font-medium">Status:</span> {orderDetails?.status}
          </p>
          <p>
            <span className="font-medium">Store:</span> {orderDetails?.storeId}
          </p>
          <p>
            <span className="font-medium">Total Amount:</span> $
            {orderDetails?.totalAmount?.toFixed(2)}
          </p>
          <p>
            <span className="font-medium">Coupon Code:</span>{" "}
            {orderDetails?.couponId || "N/A"}
          </p>
          <p>
            <span className="font-medium">Gift Card:</span>{" "}
            {orderDetails?.giftCardCode || "N/A"}
          </p>

          <h2 className="text-lg font-medium mt-4">Order Items</h2>
          <ul className="mt-2">
            {orderDetails.orderItems.map((item: any, index: number) => (
              <li
                key={index}
                className="border-b py-2 flex justify-between items-center"
              >
                <div>
                  <p>
                    <span className="font-medium">Product ID:</span>{" "}
                    {item?.productId}
                  </p>
                  <p>
                    <span className="font-medium">Quantity:</span>{" "}
                    {item?.quantity}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> $
                    {item?.price?.toFixed(2)}
                  </p>
                </div>
                <p>
                  <span className="font-medium">Reward Points:</span>{" "}
                  {item?.reward_point}
                </p>
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-medium mt-4">Payment</h2>
          <p>
            <span className="font-medium">Transaction ID:</span>{" "}
            {orderDetails?.terminalCheckout?.id}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            {orderDetails?.terminalCheckout?.status}
          </p>
          <p>
            <span className="font-medium">Amount:</span> $
            {(orderDetails?.terminalCheckout?.amount / 100)?.toFixed(2)} (
            {orderDetails?.terminalCheckout?.currency?.toUpperCase()})
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
