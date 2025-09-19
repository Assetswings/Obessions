import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../app/api";

const PaymentCheck = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("order_id");
  const transactionId = searchParams.get("transaction_id");

  useEffect(() => {
    if (orderId && transactionId) {
      fetchPaymentDetails(orderId, transactionId);
    }
  }, [orderId, transactionId]);

  const fetchPaymentDetails = async (orderId, transactionId) => {
    try {
      const res = await API.get(
        `/checkout/payment/callback?payment_id=${transactionId}&order_id=${orderId}`
      );
      if (res.data.success) {
        setTimeout(() => {
          navigate("/ordersuccess", {
            state: {
              verifyResponse: res?.data,
            },
          });
        }, 5000);
      } else {
        alert("paymentFailed");
      }
    } catch (err) {
      console.log("error ", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full max-w-sm">
        {loading ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">
              Verifying your payment...
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Please wait a moment while we confirm your transaction.
            </p>
          </>
        ) : (
          <h2 className="text-xl font-semibold text-green-500">
            Redirecting to order success ✅
          </h2>
        )}
      </div>
    </div>
  );
};

export default PaymentCheck;
