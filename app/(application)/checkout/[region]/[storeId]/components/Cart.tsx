import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { auth } from "../../../../../firebase";
import CartProducts from "./CartProducts";
import Loader from "@/components/loader";
import Payment from "@/components/Payment";

const Cart = (props: any) => {
  const router = useRouter();
  const user = auth.currentUser;
  const [discountData, setDiscountData] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState<any>(-1);
  const [giftCardBalanceUsed, setGiftCardBalanceUsed] = useState(0);
  const [giftCardBalance, setGiftCardBalance] = useState(0);

  const { products, isOpen, openCart, closeCart, setProducts, storeId } = props;

  let total = { productQuantity: 0, totalPrice: 0 };
  products.map((i: any) => {
    total.productQuantity = total.productQuantity + i.quantity;
    total.totalPrice = total.totalPrice + (i.price + i.tax_rate) * i.quantity;
  });

  const handleCheckout = async () => {
    if (total.productQuantity) {
      try {
        const res: any = await axios.post(
          "https://api.ecoboutiquemarket.com/giftcard/check-balance",
          {
            phone_number: user?.phoneNumber,
          }
        );
        if (res.data.balance >= giftCardBalanceUsed) {
          setShowCheckout(true);
        } else {
          toast.error("Your gift card balance got changed. Try again!");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
        console.error("Error fetching product:", error);
      }
    } else {
      alert("Add some product in the cart!");
    }
  };

  const handleToggleCart = (isOpen: boolean) => () =>
    isOpen ? closeCart() : openCart();

  const applyDiscount = (response: any, codetype: any) => {
    setDiscountData(response.data);

    if (codetype === "coupon" || giftCardBalanceUsed) {
      let discounted = total.totalPrice;
      if (codetype === "coupon") {
        discounted =
          discounted -
          (response.data.coupon.discount_value / 100) * total.totalPrice;
      }
      if (giftCardBalanceUsed) {
        discounted =
          discounted - giftCardBalanceUsed >= 0
            ? discounted - giftCardBalanceUsed
            : 0;
      }
      setDiscountedPrice(discounted);
    }
  };

  const handleApplyCoupon = () => {
    if (discountedPrice >= 0) {
      setDiscountedPrice(-1);
      setCouponCode("");
    } else {
      if (!couponCode) {
        setErrorMessage("Field cannot be empty");
        return;
      }
      setErrorMessage("");
      setApplyingCoupon(true);

      axios
        .post(`https://api.ecoboutiquemarket.com/retrieveCode`, {
          code: couponCode,
        })
        .then((response) => {
          const codetype = response.data.code_type;

          if (codetype === "coupon") {
            applyDiscount(response, codetype);
            setApplyingCoupon(false);
          }
        })
        .catch((error) => {
          setApplyingCoupon(false);
          toast.error(error?.response?.data?.message);
        });
    }
  };

  useEffect(() => {
    if (total.productQuantity === 0) {
      setDiscountData(null);
      setDiscountedPrice(-1);
      setCouponCode("");
    } else {
      if (discountData?.code_type === "coupon") {
        setDiscountedPrice(
          total.totalPrice -
            (discountData?.coupon?.discount_value / 100) * total.totalPrice
        );
      }
    }
  }, [total.totalPrice]);

  const handleRedeem = async (setLoading: any, orderId: any) => {
    try {
      const res: any = await axios.post(
        "https://api.ecoboutiquemarket.com/redeemCoupon",
        {
          code: couponCode,
          amount:
            discountData[discountData.code_type].amount > total.totalPrice
              ? total.totalPrice
              : discountData[discountData.code_type].amount,
          store_id: storeId.split("s")[1],
          phone_number: user?.phoneNumber,
          order_id: orderId,
          user_id: user?.phoneNumber,
        }
      );
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.error("Error fetching product:", error);
    }
  };

  const handleRedeemGiftCardBalance = async (setLoading: any) => {
    try {
      const res: any = await axios.post(
        "https://api.ecoboutiquemarket.com/redeemGiftCard",
        {
          amount: giftCardBalanceUsed,
          phone_number: user?.phoneNumber,
        }
      );
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.error("Error fetching product:", error);
    }
  };

  const handleAddOrder = async (setLoading: any, paymentIntent: any) => {
    function generateUniqueId() {
      const randomNumber = Math.floor(10000 + Math.random() * 90000);
      return `online_${randomNumber}`;
    }
    let taxAmount = 0;
    products.map((product: any) => (taxAmount += product?.tax_rate));

    try {
      const res: any = await axios.post(
        `https://api.ecoboutiquemarket.com/?action=addOrder`,
        {
          orderId: generateUniqueId(),
          storeId: storeId,
          orderDate: new Date(),
          orderItems: products.map((product: any) => ({
            productId: product.barcode,
            quantity: product.quantity,
            price: product.price,
            reward_point: product?.reward_points,
          })),

          terminalCheckout: paymentIntent,
          subTotal:
            discountedPrice >= 0
              ? discountedPrice - taxAmount
              : total.totalPrice - taxAmount,
          tax: taxAmount,
          totalAmount:
            discountedPrice >= 0
              ? discountedPrice + taxAmount
              : total.totalPrice + taxAmount,
          status: "Completed",
          couponId: discountData?.code_type === "coupon" ? couponCode : "",
          userPhone: user?.phoneNumber,
        }
      );
      if (giftCardBalanceUsed) {
        handleRedeemGiftCardBalance(setLoading);
      }
      if (couponCode) {
        handleRedeem(setLoading, res.data._id);
      }
      setLoading(false);
      router.push("/success");
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    const fetchGiftCard = async () => {
      try {
        const res: any = await axios.post(
          "https://api.ecoboutiquemarket.com/giftcard/check-balance",
          {
            phone_number: user?.phoneNumber,
          }
        );
        setGiftCardBalance(res.data.balance);
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
        console.error("Error fetching product:", error);
      }
    };
    fetchGiftCard();
  }, []);

  return (
    <>
      {applyingCoupon && <Loader />}
      {showCheckout ? (
        <Payment
          price={discountedPrice >= 0 ? discountedPrice : total.totalPrice}
          onSuccess={handleAddOrder}
          onCancel={() => {
            setShowCheckout(false);
          }}
        />
      ) : (
        <></>
      )}
      <div
        className={`sm:w-[450px] fixed top-0 w-full h-full z-[100] bg-white border shadow-sm transition-all duration-500 ${
          isOpen ? "right-0" : "-right-full sm:right-[-450px]"
        }`}
      >
        <button
          className={`absolute top-10 border shadow-sm w-12 h-12 text-center leading-[50px] bg-white z-10 ${
            isOpen ? "left-0 sm:left-[-48px]" : "left-[-50px] sm:left-[-48px]"
          } `}
          onClick={handleToggleCart(isOpen)}
        >
          {isOpen ? (
            <span>X</span>
          ) : (
            <div className="w-12 h-12 p-2">
              <div
                className="w-7 h-7 relative bg-cover bg-center invert"
                style={{ backgroundImage: "url('/images/cart-icon.png')" }}
              ></div>
              <div className="absolute bottom-0 right-1 w-4 h-4 text-xs font-bold rounded-full flex items-center justify-center">
                {total?.productQuantity}
              </div>
            </div>
          )}
        </button>

        <div className="h-full overflow-y-auto">
          <div className="text-center py-12 flex justify-center">
            <div className="relative w-14 h-14 mb-2">
              <div
                className=" w-10 h-10 inline-block  bg-cover bg-center invert"
                style={{ backgroundImage: "url('/images/cart-icon.png')" }}
              ></div>
              <div className="absolute z-20 bottom-0 right-1 w-4 h-4 text-xs font-bold rounded-full flex items-center justify-center">
                {total?.productQuantity}
              </div>
            </div>
            <span className="font-bold text-lg ml-4 mt-2">Cart</span>
          </div>

          <CartProducts products={products} setProducts={setProducts} />

          <div className="absolute bottom-0 w-full p-[5%] cartFooterShadow bg-white">
            <p className="inline-block w-1/5 ">SUBTOTAL</p>
            <div className="inline-block w-4/5 text-right ">
              <p
                className={`text-2xl m-0 ${
                  discountedPrice >= 0 ? "line-through text-red-600" : ""
                }`}
              >
                ${total?.totalPrice.toFixed(2)}
              </p>
            </div>
            {discountedPrice >= 0 && (
              <div>
                <p className="inline-block w-1/5 whitespace-nowrap">
                  AFTER DISCOUNT
                </p>
                <div className="inline-block w-4/5 text-right ">
                  <p className="text-2xl m-0">${discountedPrice?.toFixed(2)}</p>
                </div>
              </div>
            )}
            {products?.length > 0 && (
              <>
                <div className="flex mt-5">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon Code?"
                    className="w-full px-2 py-2 text-sm border rounded-lg"
                    disabled={discountedPrice >= 0}
                  />

                  <button
                    onClick={handleApplyCoupon}
                    className="w-40 bg-blue-600 text-white py-2 text-sm rounded-lg ml-4"
                  >
                    {discountedPrice >= 0 ? "Remove" : "Apply"}
                  </button>
                </div>
                <p
                  className={`text-red-500 text-sm min-h-5 block ${
                    errorMessage ? "visible" : "invisible"
                  }`}
                >
                  {errorMessage}
                </p>
                {giftCardBalance ? (
                  <div
                    onClick={() => {
                      setGiftCardBalanceUsed(giftCardBalance);
                    }}
                  >
                    Apply gift card balance
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
            <button
              className="w-full bg-blue-600 text-white py-2 text-sm rounded-lg  mt-6"
              onClick={handleCheckout}
              autoFocus
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
