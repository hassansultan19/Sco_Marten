import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import { toast, ToastContainer } from "react-toastify";

function Success() {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchPaymentDetails = async () => {
    const params = new URLSearchParams(location.search);
    const packageId = params.get("packageId");
    const token = params.get("token");

    try {
      const res = await axios.post(
        "http://192.168.18.74:800/api/admin/paypal/capture-payment",
        {
          token: token,
          package_id: Number(packageId),
          user_id: Number(localStorage.getItem("userId")),
        },
        {
          Accept: "application/json",
        }
      );

      const data = await res.data;

      if (data.status === "success") {
        setPaymentDetails(data?.data);
      } else {
        toast.error("Payment failed or was not processed.");
      }
    } catch (error) {
      toast.error("Payment failed or was not processed.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-950 min-h-[88vh] to-slate-950 flex flex-col items-center justify-center w-full rounded-3xl shadow-2xl p-8 text-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <ImSpinner2 className="animate-spin w-12 h-12 text-white" />
          <p className="text-gray-300 mt-4">Processing payment...</p>
        </div>
      ) : (
        <>
          <div className="bg-green-500 rounded-full p-3 mx-auto mb-6 w-20 h-20 flex items-center justify-center">
            <FaCheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-300 mb-6">
            Your payment has been processed successfully. Your feature profile
            is now active.
          </p>
          <div className="bg-gray-700 rounded-xl p-4 mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Transaction Details
            </h2>
            <p className="text-gray-300">Amount: ${paymentDetails?.amount}</p>
            <p className="text-gray-300">
              Package: {paymentDetails?.package_name}
            </p>
            <p className="text-gray-300">
              Transaction ID: {paymentDetails?.transaction_id}
            </p>
          </div>
          <button className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition duration-300">
            Go to Dashboard
          </button>
        </>
      )}
    </div>
  );
}

export default Success;
