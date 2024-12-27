"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import Payment from "@/components/Payment";
import { auth } from "../../../../firebase";

import "react-phone-input-2/lib/style.css";

export default function Page() {
  const router = useRouter();
  const user = auth.currentUser;

  const [showCheckout, setShowCheckout] = useState(false);

  const [amount, setAmount] = useState<any>(25);
  const [customAmount, setCustomAmount] = useState<any>("");
  const [message, setMessage] = useState("");
  const [fromName, setFromName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setrecipientPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  // const [selectedTheme, setSelectedTheme] = useState(""); // New State for theme

  // Error states
  const [amountError, setAmountError] = useState("");
  const [fromNameError, setFromNameError] = useState("");
  const [recipientNameError, setRecipientNameError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [recipientPhoneError, setRecipientPhoneError] = useState("");
  const [themeError, setThemeError] = useState(""); // New Error for theme

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

  const presetAmounts = [25, 50, 100, 250, 500];

  const validateForm = () => {
    let isValid = true;

    // Validate amount
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
    // Validate message
    if (message.trim() === "") {
      setMessageError("Please enter the gift card message.");
      isValid = false;
    } else {
      setMessageError("");
    }

    // Validate recipientPhone
    if (recipientPhone.trim() === "") {
      setRecipientPhoneError("Please enter the recipient phone number.");
      isValid = false;
    } else {
      setRecipientPhoneError("");
    }

    // // Validate theme
    // if (selectedTheme === "") {
    //   setThemeError("Please select a theme.");
    //   isValid = false;
    // } else {
    //   setThemeError("");
    // }

    return isValid;
  };

  const handleAddToCart = async () => {
    if (!validateForm()) return; // Stop if validation fails
    setShowCheckout(true);
  };

  const handleBuyGiftCard = async (setLoading: any) => {
    try {
      const response = await axios.post(
        `https://api.ecoboutiquemarket.com/giftcard/${
          quantity === 1 ? "purchase-custom" : "purchase-multiple"
        }`,
        {
          amount: (customAmount || amount) * quantity,
          message: message,
          purchaserPhone: user?.phoneNumber,
          fromName,
          recipientName,
          recipientPhone,
          quantity: quantity,
          // theme: selectedTheme, // Include theme in API payload
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setLoading(false);
      router.push("/success");
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.error("Error:", error);
    }
  };

  return (
    <>
      {showCheckout ? (
        <Payment
          price={(customAmount || amount) * quantity}
          onSuccess={handleBuyGiftCard}
          onCancel={() => {
            setShowCheckout(false);
          }}
        />
      ) : (
        <></>
      )}
      <div className="max-w-lg mx-auto px-4 py-2">
      <p
          className="cursor-pointer mb-2"
          onClick={() => {
            router.back();
          }}
        >
          &larr; Back
        </p>
        <h1 className="text-xl font-bold mb-4 text-center">
          Buy your <span className="text-blue-600">Virtual Gift Card </span>!
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
            1. Choose Amount: <span className="text-red-600">*</span>
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

        {/* 2. Choose quantity */}
        {/* <div className="mb-6">
          <h2 className="font-semibold mb-2">
            2. Choose Quantity: <span className="text-red-600">*</span>
          </h2>
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 border rounded-l-lg border-gray-300"
            >
              -
            </button>
            <span className="px-4 py-2 border-t border-b text-center w-12">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 border rounded-r-lg border-gray-300"
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">
            3. Choose a theme: <span className="text-red-600">*</span>
          </h2>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
          >
            <option value="">Select a theme</option>
            {giftCardThemes.map((theme, index) => (
              <option key={index} value={theme}>
                {theme}
              </option>
            ))}
          </select>
          {themeError && <p className="text-red-600 text-sm">{themeError}</p>}
        </div> */}

        {/* 3. Write a gift message */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">
            4. Write a Gift Message: <span className="text-red-600">*</span>
          </h2>
          <textarea
            className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
            placeholder="Enter a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {messageError && (
            <p className="text-red-600 text-sm">{messageError}</p>
          )}
        </div>

        {/* From field */}
        <div className="mb-6">
          <label htmlFor="fromName" className="font-semibold block mb-2">
            5. Sender Details: <span className="text-red-600">*</span>
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
          <h2 className="font-semibold mb-2">6. Recipient Details:</h2>
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
          <div className="mb-2">
            <PhoneInput
              country={"us"}
              value={recipientPhone}
              onChange={(phone: string) => setrecipientPhone(`+${phone}`)}
              inputStyle={{
                width: "100%",
                borderRadius: "0.5rem",
                borderColor: recipientPhoneError ? "red" : "#d1d5db",
                padding: "0.5rem 3rem",
                fontSize: "0.875rem",
              }}
              dropdownStyle={{
                borderRadius: "0.5rem",
              }}
            />
          </div>
          
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
