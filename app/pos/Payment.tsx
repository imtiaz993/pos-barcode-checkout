import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Loader from "@/components/loader";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const PaymentForm = ({
  clientSecret,
  setShowCheckout,
  setPaymentElementLoaded,
}: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };
  return (
    <>
      <div className="fixed inset-0 z-[9999999] flex items-center justify-center">
        <div className="bg-white shadow-md md:rounded-lg p-6 w-full max-w-lg h-full md:h-fit">
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
                className={`w-full rounded-full bg-blue-600 text-white font-medium py-3  mt-4  ${
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
const Payment = ({ setShowCheckout }: any) => {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentElementLoaded, setPaymentElementLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => {
        console.error("Error fetching client secret:", error);
      });
  }, []);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      {!paymentElementLoaded && <Loader />}
      {clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={options}
          stripe={stripePromise}
        >
          <PaymentForm
            clientSecret={clientSecret}
            setShowCheckout={setShowCheckout}
            setPaymentElementLoaded={setPaymentElementLoaded}
          />
        </Elements>
      ) : (
        <></>
      )}
    </>
  );
};

export default Payment;