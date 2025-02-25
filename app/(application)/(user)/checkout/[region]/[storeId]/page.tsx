"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/loader";
import Cart from "./components/Cart";
import ManualBarCode from "./components/ManualBarCode";

const BarcodeScanner = dynamic(() => import("./components/BarcodeScanner"), {
  ssr: false,
});

const POS = () => {
  const { storeId, region }: any = useParams();

  const [barcode, setBarcode] = useState("");
  const [isInputTabOpen, setIsInputTabOpen] = useState(false);

  const [products, setProducts] = useState<any>(
    JSON.parse(localStorage.getItem("products") || "[]")
  );
  const [productFetching, setProductFetching] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const lastScannedRef = useRef<{ code: string; timestamp: number }>({
    code: "",
    timestamp: 0,
  });

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
      console.log("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  return (
    <>
      <Cart
        products={products}
        storeId={storeId}
        region={region}
        setProducts={setProducts}
        isOpen={openCart}
        openCart={() => {
          setOpenCart(true);
        }}
        closeCart={() => {
          setOpenCart(false);
        }}
      />
      {isInputTabOpen && (
        <ManualBarCode
          setIsInputTabOpen={setIsInputTabOpen}
          handleDetected={handleDetected}
        />
      )}
      <div className="px-4 py-2">
        {productFetching && <Loader />}
        <div className="min-h-[calc(100dvh-62px-16px-32px)] flex flex-col justify-between w-11/12 mx-auto max-w-md">
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
                    priority={true}
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
              }}
            >
              Type Code Instead
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default POS;
