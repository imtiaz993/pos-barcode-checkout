import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Loader from "@/components/loader";
import { auth } from "../../../../firebase";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const PaymentForm = ({
  clientSecret,
  setShowCheckout,
  setPaymentElementLoaded,
  message: userMsg,
  fromName,
  recipientName,
  user,
  recipientPhone,
  price,
}: any) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleBuy = async () => {
    try {
      const response = await axios.post(
        "https://api.ecoboutiquemarket.com/api/purchase-gift-card",
        {
          amount: Number(price),
          message: userMsg,
          fromName,
          recipientName,
          recipientPhone,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Successfully added to cart:", response.data);
      setLoading(false);
      router.push("/success");
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error, paymentIntent }: any = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
    }

    if (paymentIntent.status === "succeeded") {
      handleBuy();
    }
  }

    return (
      <>
        {loading && <Loader />}
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center">
          <div className="bg-white shadow-md md:rounded-lg p-6 w-full max-w-lg h-full md:h-fit overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Complete Your Payment</h1>
              <button
                className="text-[#1b1a20] text-center leading-[50px]"
                onClick={() => {
                  setShowCheckout(false);
                }}
              >
                <span className="text-lg font-medium">X</span>
              </button>
            </div>
            {clientSecret ? (
              <form onSubmit={handleSubmit}>
                <PaymentElement onReady={() => setPaymentElementLoaded(true)} />
                <button
                  className={`w-full bg-blue-600 text-white py-2 text-sm rounded-lg  mt-4  ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                  type="submit"
                  disabled={!stripe || loading}
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
      </>
    );
  };

const Payment = ({
  setShowCheckout,
  price,
  message,
  fromName,
  recipientName,
  recipientPhone,
}: any) => {
  const user = auth.currentUser;

  const [clientSecret, setClientSecret] = useState("");
  const [paymentElementLoaded, setPaymentElementLoaded] = useState(false);

  useEffect(() => {
    axios
      .post("/api/create-payment-intent", {
        price: Number(price) * 100,
        phone: user?.phoneNumber,
      })
      .then((response) => {
        setClientSecret(response.data.clientSecret);
      })
      .catch((error) => {
        console.error("Error fetching client secret:", error);
      });
  }, []);

  const appearance = {
    theme: "stripe",
  };

  const options: any = {
    clientSecret,
    appearance,
  };

  return (
    <>
      {!paymentElementLoaded && <Loader />}
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm
            clientSecret={clientSecret}
            setShowCheckout={setShowCheckout}
            setPaymentElementLoaded={setPaymentElementLoaded}
            message={message}
            fromName={fromName}
            recipientName={recipientName}
            recipientPhone={recipientPhone}
            user={user}
            price={price}
          />
        </Elements>
      ) : (
        <></>
      )}
    </>
  );
};

export default Payment;
