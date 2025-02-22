import { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const Refund = ({ paymentIntentId }: any) => {
  const searchParams = useSearchParams();
  const id: any = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  const handleUpdateTask = async () => {
    try {
      await axios.post(
        `https://api.ecoboutiquemarket.com/taskRefunded`,
        { id: id },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Refund Successful!");
      //Todo: make payment status false of the task & remove paymentIntent
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.log("Error:", error);
    }
  };

  const handleRefund = async () => {
    setLoading(true);
    if (!paymentIntentId) return toast.error("Payment Intent ID is required");

    try {
      await axios.post("/api/stripe/refund", {
        paymentIntentId,
      });
      handleUpdateTask();
    } catch (error: any) {
      console.log("Refund Error:", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 md:mt-0 flex justify-end mr-2">
      <button
        type="button"
        onClick={handleRefund}
        className={`bg-blue-600 text-white py-1.5 px-5 my-2 text-sm rounded-lg hover:bg-blue-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Processing..." : "Refund"}
      </button>
    </div>
  );
};

export default Refund;
