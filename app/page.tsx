"use client";

import React, { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { toast } from "sonner"

const BarcodeScanner = dynamic(() => import("./BarcodeScanner"), {
  ssr: false,
});

const App = () => {
  const [barcode, setBarcode] = useState("");
  const [isInputTabOpen, setIsInputTabOpen] = useState(false);
  const [inputBarcode, setInputBarcode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [productFetched, setProductFetched] = useState<any>(null);

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
    console.log(code, barcode, code != barcode);
    
    if (code != barcode) {
      setBarcode(code);
      if (beepSound) {
        beepSound.play();
      }
      try {
        const response: any = await axios.get(`http://34.102.44.108:8000/`, {
          params: {
            action: "getProductByBarcode",
            barcode: code,
            store_id: 111,
            access_token: "AIzaSyAAlqEYx2CDm5ck_64dc5b7371872a01b653",
          },
        });
        setProductFetched(response?.result);
      } catch (error:any) {
        toast(error?.message)
        console.error("Error fetching product:", error);
      }
    }
  };

  const handleError = () => {};

  console.log(productFetched);

  return (
    <div className="bg-[rgba(0,0,0,0.9)]">
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
      {isInputTabOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-950 border border-white px-5 pt-5 pb-10 rounded-xl w-11/12 sm:w-1/2 lg:w-1/3 transform transition-all">
            <div className="flex justify-between">
              <p className="text-white text-lg font-semibold">
                Enter Barcode Manually
              </p>
              <p
                className="mb-10 text-2xl text-white cursor-pointer"
                onClick={() => {
                  setIsInputTabOpen(false);
                  setErrorMessage("");
                }}
              >
                &#10006;
              </p>
            </div>
            <input
              type="number"
              value={inputBarcode}
              onChange={(e) => setInputBarcode(e.target.value)}
              placeholder="Enter barcode"
              className="w-full p-3 rounded mb-2"
            />
            <p
              className={`text-red-500 text-sm min-h-5 ${
                errorMessage ? "visible" : "invisible"
              }`}
            >
              {errorMessage}
            </p>
            <button
              onClick={handleInputSubmit}
              className="w-full rounded-full bg-blue-600 text-white font-medium py-3 mt-2"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
