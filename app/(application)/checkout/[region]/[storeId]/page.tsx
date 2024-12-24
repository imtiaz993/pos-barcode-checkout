"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useParams, usePathname } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/loader";
import Cart from "./components/Cart";

const BarcodeScanner = dynamic(() => import("./components/BarcodeScanner"), {
  ssr: false,
});

const POS = () => {
  const { storeId, region }: any = useParams();
  const pathname = usePathname();
  const type: any = pathname.includes("/checkout")
    ? "/checkout"
    : pathname.includes("/giftcard")
    ? "/giftcard"
    : "";

  const [barcode, setBarcode] = useState("");
  const [isInputTabOpen, setIsInputTabOpen] = useState(false);
  const [inputBarcode, setInputBarcode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [products, setProducts] = useState<any>([]);
  const [productFetching, setProductFetching] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const lastScannedRef = useRef<{ code: string; timestamp: number }>({
    code: "",
    timestamp: 0,
  });

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

  const handleDetected = async (code: any, beepSound: any) => {
    if (!code) return;

    const now = Date.now();
    const timeThreshold = 5000;

    const { code: lastCode, timestamp: lastTimestamp } = lastScannedRef.current;

    if (
      (code === lastCode && now - lastTimestamp < timeThreshold) ||
      productFetching
    ) {
      console.log("Ignoring immediate repeated scan");
      return;
    }

    lastScannedRef.current = { code, timestamp: now };

    if (beepSound) {
      beepSound.play();
    }

    setBarcode(code);

    try {
      setProductFetching(true);
      const response: any = await axios.get(
        `https://api.ecoboutiquemarket.com/`,
        {
          params: {
            action: "getProductByBarcode",
            barcode: code,
            store_id: storeId.split("s")[1],
            access_token: "AIzaSyAAlqEYx2CDm5ck_64dc5b7371872a01b653",
          },
        }
      );
      setProductFetching(false);
      setProducts((prev: any) => {
        const alreadyAddedIndex = prev.findIndex(
          (item: any) => item.id === response.data?.result.id
        );

        if (alreadyAddedIndex !== -1) {
          return prev.map((item: any, index: number) =>
            index === alreadyAddedIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [{ ...response.data?.result, quantity: 1 }, ...prev];
        }
      });
      setOpenCart(true);
      setTimeout(() => {
        setOpenCart(false);
      }, 2000);
    } catch (error: any) {
      setProductFetching(false);
      toast.error(error?.response?.data?.message);
      console.error("Error fetching product:", error);
    }
  };

  return (
    <>
      <Cart
        products={products}
        storeId={storeId}
        setProducts={setProducts}
        isOpen={openCart}
        openCart={() => {
          setOpenCart(true);
        }}
        closeCart={() => {
          setOpenCart(false);
        }}
      />

      <div className="">
        <div className="fixed top-2 left-2">
          <Link
            href={`/user-profile?type=${type}&region=${region}&storeId=${storeId}`}
          >
            <Image
              src="/images/profile.png"
              width={0}
              height={0}
              sizes="100vw"
              alt=""
              className="w-8 cursor-pointer"
            />
          </Link>
        </div>
        {productFetching && <Loader />}
        <div className="min-h-dvh flex flex-col justify-between w-11/12 mx-auto max-w-[540px]">
          <div></div>
          <div>
            <BarcodeScanner onScan={handleDetected} openCart={openCart} />
            {barcode && (
              <p className="text-center text-[#71717a] mt-5">
                Detected Barcode: {barcode}
              </p>
            )}
            <h1 className="text-center font-medium text-[#71717a] my-5 mb-2">
              Make sure the barcode is horizontal, <br />
              See example below
            </h1>
            <div className="w-3/4 mx-auto">
              <div className="h-44 border-2 p-0.5 mx-auto relative">
                <div className="p-5 h-full">
                  <Image
                    src="/images/exampleBarCode.png"
                    width={0}
                    height={0}
                    sizes="100vw"
                    alt=""
                    className="w-full max-h-[136px] object-contain"
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    width: "calc(100% - 20px)",
                    height: "2px",
                    backgroundColor: "red",
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="pt-10 pb-5">
            <button
              className="w-full py-2 text-sm rounded-lg bg-blue-600 text-white"
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
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
            <div className="bg-white border px-5 pt-5 pb-10 rounded-lg w-11/12 sm:w-1/2 lg:w-1/3 transform transition-all">
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
        )}
      </div>
    </>
  );
};

export default POS;
