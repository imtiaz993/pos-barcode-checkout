import CartProducts from "./CartProducts";
import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const Cart = (props: any) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const { products, isOpen, openCart, closeCart, setProducts } = props;

  let total = { productQuantity: 0, totalPrice: 0 };
  products.map((i: any) => {
    total.productQuantity = total.productQuantity + i.quantity;
    total.totalPrice = total.totalPrice + i.price * i.quantity;
  });

  const handleCheckout = () => {
    if (total.productQuantity) {
      setShowCheckout(true);
      alert(`Checkout - Subtotal: ${total.totalPrice.toFixed(2)}`);
    } else {
      alert("Add some product in the cart!");
    }
  };

  const handleToggleCart = (isOpen: boolean) => () =>
    isOpen ? closeCart() : openCart();

  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch the client secret from the backend
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error }: any = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`, // Redirect after successful payment
      },
    });

    if (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  return !showCheckout ? (
    <div
      className={`sm:w-[450px] fixed top-0 w-full h-full bg-[#1b1a20] z-[100] transition-all duration-500 ${
        isOpen ? "right-0" : "-right-full sm:right-[-450px]"
      }`}
    >
      <button
        className={`absolute top-0  w-12 h-12 bg-[#1b1a20] text-white text-center leading-[50px] z-10 ${
          isOpen
            ? "bg-[#1b1a20]  left-0 sm:left-[-48px]"
            : "left-[-50px] sm:left-[-48px]"
        } hover:bg-black`}
        onClick={handleToggleCart(isOpen)}
      >
        {isOpen ? (
          <span>X</span>
        ) : (
          <div className="w-12 h-12 bg-[#1b1a20] p-2">
            <div
              className="w-7 h-7 relative bg-cover bg-center "
              style={{ backgroundImage: "url('/images/cart-icon.png')" }}
            ></div>
            <div className="absolute bottom-0 right-1 w-4 h-4 bg-white text-xs font-bold text-black rounded-full flex items-center justify-center">
              {total?.productQuantity}
            </div>
          </div>
        )}
      </button>

      <div className="h-full overflow-y-auto">
        <div className="text-white text-center py-12 flex justify-center">
          <div className="relative w-14 h-14 mb-2">
            <div
              className=" w-10 h-10 inline-block  bg-cover bg-center "
              style={{ backgroundImage: "url('/images/cart-icon.png')" }}
            ></div>
            <div className="absolute z-20 bottom-0 right-1 w-4 h-4 text-xs bg-white font-bold text-black rounded-full flex items-center justify-center">
              {total?.productQuantity}
            </div>
          </div>
          <span className="font-bold text-lg ml-4 mt-2">Cart</span>
        </div>

        <CartProducts products={products} setProducts={setProducts} />

        <div className="absolute bottom-0 w-full h-[200px] p-[5%] bg-[#1b1a20] cartFooterShadow">
          <p className="inline-block w-1/5 text-[#5b5a5e]">SUBTOTAL</p>
          <div className="inline-block w-4/5 text-right text-[#5b5a5e]">
            <p className="text-2xl text-secondary m-0">
              ${total?.totalPrice.toFixed(2)}
            </p>
          </div>
          <button
            className="w-full bg-[#0c0b10] text-[#ececec] uppercase py-3 mt-10 hover:bg-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            onClick={handleCheckout}
            autoFocus
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>
        {clientSecret ? (
          <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button
              type="submit"
              disabled={!stripe || loading}
              className={`mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        ) : (
          <p>Loading...</p>
        )}
        {message && <p className="text-red-500 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default Cart;
