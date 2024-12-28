import { useState, useEffect } from "react";
import axios from "axios";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Loader from "@/components/loader";
import { auth } from "../app/firebase";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const PaymentForm = ({
  clientSecret,
  savedPaymentMethods,
  setPaymentElementLoaded,
  handleSuccess = () => {},
  handleCancel = () => {},
}: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayWithSavedCard = async (methodId?: any) => {
    setLoading(true);
    if (!stripe) {
      setLoading(false);
      return;
    }
    const { error, paymentIntent }: any = await stripe.confirmPayment({
      clientSecret: clientSecret,
      confirmParams: {
        payment_method: methodId,
        return_url: `${window.location.origin}/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      handleSuccess(setLoading, paymentIntent);
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
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      handleSuccess(setLoading, paymentIntent);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="fixed inset-0 z-[9999999] flex items-center justify-center">
        <div className="bg-white shadow-md md:rounded-lg p-6 w-full max-w-md h-full md:h-fit overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Complete Your Payment</h1>
            <button
              className="text-[#1b1a20] text-center leading-[50px]"
              onClick={handleCancel}
            >
              <span className="text-lg font-medium">X</span>
            </button>
          </div>
          {clientSecret ? (
            <form onSubmit={handleSubmit}>
              {savedPaymentMethods.map((method: any, index: number) => (
                <div
                  key={index}
                  onClick={(e) => {
                    handlePayWithSavedCard(method.id);
                  }}
                  className="flex items-center justify-between p-3 border rounded-lg mb-2 cursor-pointer"
                >
                  <p>Pay with</p>
                  <span className="ml-2">
                    {method.card.brand.toUpperCase()} **** {method.card.last4}{" "}
                    (Expires {method.card.exp_month}/{method.card.exp_year})
                  </span>
                </div>
              ))}
              <div className="flex items-center mt-10 mb-5">
                <div className="h-[1px] w-full bg-black"></div>
                <h2 className=" whitespace-nowrap mx-5 text-lg">
                  Add New Card
                </h2>
                <div className="h-[1px] w-full bg-black"></div>
              </div>
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

const Payment = ({ price, onSuccess, onCancel }: any) => {
  const user = auth.currentUser;

  const [clientSecret, setClientSecret] = useState("");
  const [savedPaymentMethods, setSavedPaymentMethods] = useState("");
  const [paymentElementLoaded, setPaymentElementLoaded] = useState(false);

  useEffect(() => {
    axios
      .post("/api/create-payment-intent", {
        price: Math.round(Number(price) * 100),
        phone: user?.phoneNumber,
      })
      .then((response) => {
        setClientSecret(response.data.clientSecret);
        setSavedPaymentMethods(response.data.paymentMethods);
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
            savedPaymentMethods={savedPaymentMethods}
            setPaymentElementLoaded={setPaymentElementLoaded}
            handleSuccess={onSuccess}
            handleCancel={onCancel}
          />
        </Elements>
      ) : (
        <></>
      )}
    </>
  );
};

export default Payment;
