import Image from "next/image";

const SuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto w-11/12">
      <div className="mb-6">
        <Image src="/images/check.png" alt="Success" width={150} height={150} />
      </div>

      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h1>

      <p className="text-gray-600 text-center max-w-md">
        Thank you for your payment. Your transaction was completed successfully.
      </p>
    </div>
  );
};

export default SuccessPage;
