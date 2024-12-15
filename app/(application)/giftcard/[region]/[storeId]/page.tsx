"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import Payment from "./Payment";

export default function Page() {
  const [showCheckout, setShowCheckout] = useState(false);

  const [amount, setAmount] = useState<number | "">(25);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [fromName, setFromName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setrecipientPhone] = useState("");

  // Error states
  const [amountError, setAmountError] = useState("");
  const [fromNameError, setFromNameError] = useState("");
  const [recipientNameError, setRecipientNameError] = useState("");
  const [recipientPhoneError, setRecipientPhoneError] = useState("");

  const presetAmounts = [25, 50, 100, 250, 500];

  const validateForm = () => {
    let isValid = true;

    // Validate amount: either amount is selected or customAmount is provided
    if ((amount === "" || amount === undefined) && customAmount.trim() === "") {
      setAmountError("Please select or enter an amount.");
      isValid = false;
    } else {
      setAmountError("");
    }

    // Validate fromName
    if (fromName.trim() === "") {
      setFromNameError("Please enter the sender name.");
      isValid = false;
    } else {
      setFromNameError("");
    }

    // Validate recipientName
    if (recipientName.trim() === "") {
      setRecipientNameError("Please enter the recipient name.");
      isValid = false;
    } else {
      setRecipientNameError("");
    }

    // Validate recipientPhone (basic check)
    if (recipientPhone.trim() === "") {
      setRecipientPhoneError("Please enter the recipient phone number.");
      isValid = false;
    } else {
      setRecipientPhoneError("");
    }

    return isValid;
  };

  const handleAddToCart = async () => {
    if (!validateForm()) return; // Stop if validation fails

    setShowCheckout(true)
  };

  return (
    <>
      {showCheckout ? (
        <Payment
          setShowCheckout={setShowCheckout}
          price={customAmount || amount}
          message={message}
          fromName={fromName}
          recipientName={recipientName}
          recipientPhone={recipientPhone}
        />
      ) : (
        <></>
      )}
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-4 text-center">
          Buy your{" "}
          <span className="text-blue-600">Virtual Gift Card </span>!
        </h1>

        {/* Card Preview */}
        <div className="w-full rounded-lg overflow-hidden mb-8 flex items-center justify-center">
          <Image
            src="/images/gift_card.png"
            width={0}
            height={0}
            sizes="100vw"
            alt=""
            className="w-full"
          />
        </div>

        {/* 1. Choose amount */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">
            1. Choose amount: <span className="text-red-600">*</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setAmount(amt);
                  setCustomAmount("");
                }}
                className={`px-4 py-2 rounded border ${
                  amount === amt
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
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setAmount("");
              }}
              className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
              placeholder="500.00"
            />
          </div>
          {amountError && <p className="text-red-600 text-sm">{amountError}</p>}
        </div>

        {/* 3. Write a gift message */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">3. Write a gift message:</h2>
          <textarea
            className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
            placeholder="Enter a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* From field */}
        <div className="mb-6">
          <label htmlFor="fromName" className="font-semibold block mb-2">
            3. Sender information: <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="fromName"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            placeholder="Enter sender name..."
            className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
          />
          {fromNameError && (
            <p className="text-red-600 text-sm">{fromNameError}</p>
          )}
        </div>

        {/* Recipient information */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">4. Recipient information:</h2>
          <label className="block mb-1 text-sm" htmlFor="recipientName">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="recipientName"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Enter recipient name"
            className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
          />
          {recipientNameError && (
            <p className="text-red-600 text-sm">{recipientNameError}</p>
          )}

          <label className="block mb-1 text-sm" htmlFor="recipientPhone">
            Phone Number <span className="text-red-600">*</span>
          </label>
          <input
            type="phone"
            id="recipientPhone"
            value={recipientPhone}
            onChange={(e) => setrecipientPhone(e.target.value)}
            placeholder="+123456789"
            className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
          />
          {recipientPhoneError && (
            <p className="text-red-600 text-sm">{recipientPhoneError}</p>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-2 w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700"
        >
          Purchase
        </button>
      </div>
    </>
  );
}
