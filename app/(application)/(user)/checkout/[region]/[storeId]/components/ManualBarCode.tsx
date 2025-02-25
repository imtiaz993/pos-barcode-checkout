import React, { useState } from "react";
import Image from "next/image";

const ManualBarCode = ({ setIsInputTabOpen, handleDetected }: any) => {
  const [inputBarcode, setInputBarcode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleInputSubmit = () => {
    if (!inputBarcode) {
      setErrorMessage("Barcode cannot be empty");
      return;
    }
    setErrorMessage("");
    handleDetected(inputBarcode, null);
    setIsInputTabOpen(false);
    setErrorMessage("");
    setInputBarcode("");
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
      <div className="bg-white border px-5 pt-5 pb-10 rounded-lg w-11/12 sm:w-1/2 mx-auto lg:w-1/3 transform transition-all max-w-md">
        <div className="flex justify-between">
          <p className="text-lg font-semibold">Enter Barcode Manually</p>
          <p
            className="mb-10 cursor-pointer text-lg font-medium text-center"
            onClick={() => {
              setIsInputTabOpen(false);
              setErrorMessage("");
            }}
          >
            <span>X</span>
          </p>
        </div>
        <div>
          <Image
            src="/images/barcode_example.jpg"
            priority={true}
            width={0}
            height={0}
            sizes="100vw"
            alt=""
            className="w-full max-h-[136px] object-contain"
          />
          <h1 className="text-center mt-2 mb-6 font-medium text-sm">
            Type all the digit as shown above.
          </h1>
        </div>
        <input
          type="number"
          value={inputBarcode}
          onChange={(e) => setInputBarcode(e.target.value)}
          placeholder="Enter barcode"
          className="w-full px-2 py-2 text-sm border rounded-lg mb-2"
        />
        <p
          className={`text-red-500 text-sm ${
            errorMessage ? "visible" : "invisible"
          }`}
        >
          {errorMessage}
        </p>
        <button
          onClick={handleInputSubmit}
          className="w-full py-2 text-sm rounded-lg bg-blue-600 text-white mt-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ManualBarCode;
