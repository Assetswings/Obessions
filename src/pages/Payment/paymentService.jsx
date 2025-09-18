// src/services/paymentService.js
import API from "../../app/api";

// Initiate Razorpay Payment
  export const initiatePayment = async (payload) => {
  try {
      const response = await API.post("/checkout/payment-initiate", payload);

    // response.data.data.data contains { razorpay_key, order, callback_url }
    return response.data.data.data;
    } catch (error) {
    console.error("Error initiating payment:", error.response?.data || error);
    throw error;
  }
};

// Verify Payment via Callback
export const verifyPayment = async (paymentId, orderId) => {
  try {
    const response = await API.get(
      `/checkout/payment/callback?payment_id=${paymentId}&order_id=${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error.response?.data || error);
    throw error;
  }
};











