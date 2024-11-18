"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { toast } from "sonner";
import Loader from "@/components/loader";

const BarcodeScanner = dynamic(() => import("./BarcodeScanner"), {
  ssr: false,
});

const App = () => {
  const [barcode, setBarcode] = useState("");
  const [isInputTabOpen, setIsInputTabOpen] = useState(false);
  const [inputBarcode, setInputBarcode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [productFetched, setProductFetched] = useState<any>(null);
  const [productFetching, setProductFetching] = useState(false);
  const lastScannedRef = useRef<{ code: string; timestamp: number }>({
    code: "",
    timestamp: 0,
  });

  const handleInputSubmit = () => {
    if (!inputBarcode) {
      setErrorMessage("Barcode cannot be empty");
      return;
    }
    setErrorMessage(""); // Clear any previous error
    handleDetected(inputBarcode, null);
    setIsInputTabOpen(false);
    setErrorMessage("");
    setInputBarcode("");
  };

  const handleDetected = async (code: any, beepSound: any) => {
    if (!code) return;

    const now = Date.now();
    const timeThreshold = 5000;

    const { code: lastCode, timestamp: lastTimestamp } = lastScannedRef.current;

    // Check if the code is the same and within the time threshold
    if (code === lastCode && now - lastTimestamp < timeThreshold) {
      console.log("Ignoring immediate repeated scan");
      return; // Ignore the scan
    }

    // Update the last scanned code and timestamp
    lastScannedRef.current = { code, timestamp: now };

    if (beepSound) {
      beepSound();
    }

    setBarcode(code);

    try {
      setProductFetching(true);
      const response: any = await axios.get(`http://34.102.44.108:8000/`, {
        params: {
          action: "getProductByBarcode",
          barcode: code,
          store_id: 111,
          access_token: "AIzaSyAAlqEYx2CDm5ck_64dc5b7371872a01b653",
        },
      });
      setProductFetching(false);
      setProductFetched(response?.result);
    } catch (error: any) {
      setProductFetching(false);
      toast(error?.message);
      console.error("Error fetching product:", error);
    }
  };

  const handleError = () => {};

  console.log(productFetched);

  return (
    <div className="bg-[rgba(0,0,0,0.9)]">
      {productFetching && <Loader />}
      <div className="min-h-dvh flex flex-col justify-between w-11/12 mx-auto max-w-[540px]">
        <div></div>
        <div>
          <h1 className="text-center text-lg font-medium text-white my-10">
            Point at code to scan
          </h1>
          <BarcodeScanner onScan={handleDetected} onError={handleError} />
          {barcode && (
            <p className="text-center text-white mt-5">
              Detected Barcode: {barcode}
            </p>
          )}
          {productFetched && (
            <div className="text-white mt-5">
              <h2 className="font-semibold">Product Fetched:</h2>
              <div className="flex items-start mt-4">
                {productFetched?.images &&
                  productFetched?.images?.length > 0 && (
                    <Image
                      src={productFetched.images[0].src}
                      width={50}
                      height={50}
                      className="object-cover"
                      alt={productFetched.images[0].alt}
                    />
                  )}
                <div className="ml-5">
                  <p>{productFetched?.name}</p>
                  <div className="flex my-2.5">
                    <p>Price: {productFetched?.price}</p>
                    <p className="ml-5">Tax: {productFetched?.tax_rate}</p>
                  </div>
                  <p className="text-xs">{productFetched?.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="pt-10 pb-16">
          <button
            onClick={() => {
              handleDetected("850033937077", null);
            }}
            className="w-full rounded-full bg-gray-300 text-black font-medium py-3 mb-5"
          >
            TEST 850033937077
          </button>
          <button
            className="w-full rounded-full bg-blue-600 text-white font-medium py-3"
            onClick={() => {
              setIsInputTabOpen(!isInputTabOpen);
              setErrorMessage("");
            }}
          >
            Type Code Instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
