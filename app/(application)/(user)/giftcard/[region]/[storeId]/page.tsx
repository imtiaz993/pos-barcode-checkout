"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import Payment from "@/components/Payment";

import "react-phone-input-2/lib/style.css";
import Loader from "@/components/loader";

import { useFormik } from "formik";
import * as Yup from "yup";
import { getUserData } from "@/lib/auth";

export default function Page() {
  const router = useRouter();
  const { storeId, region }: any = useParams();

  const user = getUserData();

  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);

  const presetAmounts = [10, 25, 50, 100, 250, 500];
  const giftCardThemes = [
    "Birthday",
    "Thank You",
    "Christmas",
    "Anniversary",
    "Wedding",
    "New Baby",
    "Graduation",
    "Get Well Soon",
    "Mother's Day",
    "Father's Day",
    "Housewarming",
    "Valentine's Day",
    "New Year",
    "Baby Shower",
    "Back to School",
  ];

  const formik = useFormik({
    initialValues: {
      amount: 10,
      customAmount: "",
      message: "",
      fromName: "",
      recipientName: "",
      recipientPhone: "",
      quantity: 1,
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .test(
          "amount-or-custom",
          "Please select or enter a value $10 and above.",
          function (value) {
            const { customAmount } = this.parent;
            return value || (customAmount && customAmount >= 10);
          }
        )
        .nullable(),
      customAmount: Yup.number()
        .test(
          "custom-amount-minimum",
          "Please enter a value $10 and above.",
          (value) => !value || value >= 10
        )
        .nullable(),
      message: Yup.string().required("Please enter the gift card message."),
      fromName: Yup.string().required("Please enter the sender name."),
      recipientName: Yup.string().required("Please enter the recipient name."),
      recipientPhone: Yup.string().required(
        "Please enter the recipient phone number."
      ),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setShowCheckout(true);
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error(error);
      }
    },
  });

  const handleBuyGiftCard = async () => {
    const {
      amount,
      customAmount,
      message,
      fromName,
      recipientName,
      recipientPhone,
      quantity,
    } = formik.values;
    try {
      const response = await axios.post(
        `https://api.ecoboutiquemarket.com/giftcard/${
          quantity === 1 ? "purchase-custom" : "purchase-multiple"
        }`,
        {
          amount: (Number(customAmount) || amount) * quantity,
          message,
          purchaserPhone: user?.phone_number,
          fromName,
          recipientName,
          recipientPhone,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setLoading(false);
      router.push(`/success?region=${region}&storeId=${storeId}`);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.error("Error:", error);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {showCheckout ? (
        <Payment
          price={
            (Number(formik.values.customAmount) || formik.values.amount) *
            formik.values.quantity
          }
          onSuccess={handleBuyGiftCard}
          onCancel={() => {
            setShowCheckout(false);
          }}
          onPaymentCreatedIntent={() => {
            setLoading(false);
          }}
        />
      ) : (
        <></>
      )}
      <div className="max-w-md mx-auto px-4 py-2">
        <h1 className="text-xl font-bold mb-4 text-center mt-5">
          Buy your <span className="text-blue-600">Virtual Gift Card </span>!
        </h1>

        {/* Card Preview */}
        <div className="w-full rounded-lg overflow-hidden mb-8 flex items-center justify-center">
          <Image
            priority={true}
            src="/images/gift_card.png"
            width={0}
            height={0}
            sizes="100vw"
            alt=""
            className="w-full"
          />
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* 1. Choose amount */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">
              1. Choose Amount: <span className="text-red-600">*</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {presetAmounts.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => {
                    formik.setFieldValue("amount", amt);
                    formik.setFieldValue("customAmount", "");
                  }}
                  className={`px-4 py-2 rounded border ${
                    formik.values.amount === amt
                      ? "bg-blue-100 border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <label htmlFor="customAmount" className="block text-sm mb-1">
                Custom Amount
              </label>
              <input
                type="number"
                id="customAmount"
                value={formik.values.customAmount}
                onChange={(e) => {
                  formik.setFieldValue("customAmount", e.target.value);
                  formik.setFieldValue("amount", "");
                }}
                className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
                placeholder="500.00"
              />
              {formik.errors.amount && (
                <p className="text-red-600 text-sm">{formik.errors.amount}</p>
              )}
            </div>
          </div>

          {/* 2. Write a gift message */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">
              2. Write a Gift Message: <span className="text-red-600">*</span>
            </h2>
            <textarea
              id="message"
              className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
              placeholder="Enter a message..."
              value={formik.values.message}
              onChange={formik.handleChange}
            />
            {formik.errors.message && (
              <p className="text-red-600 text-sm">{formik.errors.message}</p>
            )}
          </div>

          {/* From field */}
          <div className="mb-6">
            <label htmlFor="fromName" className="font-semibold block mb-2">
              3. Sender Details: <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="fromName"
              value={formik.values.fromName}
              onChange={formik.handleChange}
              placeholder="Enter sender name..."
              className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
            />
            {formik.errors.fromName && (
              <p className="text-red-600 text-sm">{formik.errors.fromName}</p>
            )}
          </div>

          {/* Recipient information */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">4. Recipient Details:</h2>
            <label className="block mb-1 text-sm" htmlFor="recipientName">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="recipientName"
              value={formik.values.recipientName}
              onChange={formik.handleChange}
              placeholder="Enter recipient name"
              className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
            />
            {formik.errors.recipientName && (
              <p className="text-red-600 text-sm">
                {formik.errors.recipientName}
              </p>
            )}

            <label className="block mb-1 text-sm" htmlFor="recipientPhone">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <div className="mb-2">
              <PhoneInput
                country={"us"}
                value={formik.values.recipientPhone}
                onChange={(phone: string) =>
                  formik.setFieldValue("recipientPhone", `+${phone}`)
                }
                inputStyle={{
                  width: "100%",
                  borderRadius: "0.5rem",
                  borderColor: formik.errors.recipientPhone ? "red" : "#d1d5db",
                  padding: "0.5rem 3rem",
                  fontSize: "0.875rem",
                }}
                dropdownStyle={{
                  borderRadius: "0.5rem",
                }}
              />
            </div>

            {formik.errors.recipientPhone && (
              <p className="text-red-600 text-sm">
                {formik.errors.recipientPhone}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700"
          >
            Purchase
          </button>
        </form>
      </div>
    </>
  );
}
