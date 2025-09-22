import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../app/api";
import processvideo from "../../assets/icons/Obsessionsgiffff.gif";

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
      <div className="rounded-2xl p-8 text-center w-full max-w-sm">
        {loading ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin">
                <img  src={processvideo} alt="loader"  height={300} width={300 }/>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">
              Please wait while we securely process your Order!
            </h2>
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
