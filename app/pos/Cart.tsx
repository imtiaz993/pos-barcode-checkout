import CartProducts from "./CartProducts";
import { useState, useEffect } from "react";
import Payment from "./Payment";
import { toast } from "sonner";
import axios from "axios";
import Loader from "@/components/loader";
import { auth } from "../firebase";

const Cart = (props: any) => {
  const user = auth.currentUser;
  const [discountData, setDiscountData] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [couponGiftCard, setCouponGiftCard] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState<any>(-1);

  const { products, isOpen, openCart, closeCart, setProducts, storeId } = props;

  let total = { productQuantity: 0, totalPrice: 0 };
  products.map((i: any) => {
    total.productQuantity = total.productQuantity + i.quantity;
    total.totalPrice = total.totalPrice + i.price * i.quantity;
  });

  const handleCheckout = () => {
    if (total.productQuantity) {
      setShowCheckout(true);
    } else {
      alert("Add some product in the cart!");
    }
  };

  const handleToggleCart = (isOpen: boolean) => () =>
    isOpen ? closeCart() : openCart();

  const handleApplyCoupon = async () => {
    if (discountedPrice >= 0) {
      setDiscountedPrice(-1);
      setCouponGiftCard("");
    } else {
      if (!couponGiftCard) {
        setErrorMessage("Field cannot be empty");
        return;
      }
      setErrorMessage("");
      try {
        setApplyingCoupon(true);
        const response: any = await axios.post(
          `https://api.ecoboutiquemarket.com/retrieveCode`,
          {
            code: couponGiftCard,
          }
        );
        setDiscountData(response.data);

        const codetype = response.data.code_type;

        if (codetype === "coupon") {
          setDiscountedPrice(
            total.totalPrice -
              (response.data.coupon.discount_value / 100) * total.totalPrice
          );
        } else {
          setDiscountedPrice(
            Math.max(0, total.totalPrice - response.data.gift_card.balance)
          );
        }

        setApplyingCoupon(false);
      } catch (error: any) {
        setApplyingCoupon(false);
        toast.error(error?.response?.data?.message);
        console.error("Error fetching product:", error);
      }
    }
  };

  useEffect(() => {
    console.log(total);
    if (total.productQuantity === 0) {
      setDiscountData(null);
      setDiscountedPrice(-1);
      setCouponGiftCard("");
    } else {
      if (discountData?.code_type === "coupon") {
        setDiscountedPrice(
          total.totalPrice -
            (discountData?.coupon?.discount_value / 100) * total.totalPrice
        );
      } else if (discountData?.code_type === "gift_card") {
        setDiscountedPrice(
          Math.max(0, total.totalPrice - discountData?.gift_card?.balance)
        );
      }
    }
  }, [total.totalPrice]);

  return (
    <>
      {applyingCoupon && <Loader />}
      {showCheckout ? (
        <Payment
          setShowCheckout={setShowCheckout}
          price={discountedPrice >= 0 ? discountedPrice : total.totalPrice}
          couponGiftCard={couponGiftCard}
          storeId={storeId}
          codetype={discountData?.code_type}
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
          className={`absolute top-0 border shadow-sm w-12 h-12 text-center leading-[50px] z-10 ${
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

          <div className="absolute bottom-0 w-full p-[5%] cartFooterShadow">
            <p className="inline-block w-1/5 ">SUBTOTAL</p>
            <div className="inline-block w-4/5 text-right ">
              <p
                className={`text-2xl m-0 ${
                  discountedPrice >= 0 ? "line-through" : ""
                }`}
              >
                ${total?.totalPrice.toFixed(2)}
              </p>
            </div>
            {discountedPrice >= 0 && (
              <div>
                <p className="inline-block w-1/5 ">DISCOUNTED</p>
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
                    value={couponGiftCard}
                    onChange={(e) => setCouponGiftCard(e.target.value)}
                    placeholder="Coupon or Gift Card?"
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
