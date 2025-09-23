import React from "react";
import { useNavigate } from "react-router-dom";

const CartToast = ({ product, onViewCart, onCheckout, onClose }) => {
    const navigate = useNavigate();
  return (
    <div style={{ width: "360px", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          paddingBottom: "8px",
          marginBottom: "10px",
        }}
      >
        <span style={{ color: "green", fontWeight: "bold", fontSize: "14px" }}>
          ✔ Added to your Cart
        </span>
        <span
          style={{
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
          }}
          onClick={onClose}
        >
          ✕
        </span>
      </div>

      {/* Product section */}
      <div style={{ display: "flex", gap: "12px" }}>
        {/* Thumbnail */}
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "80px",
            height: "100px",
            objectFit: "cover",
            border: "1px solid #ddd",
          }}
        />

        {/* Details */}
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: "bold", margin: "0 0 4px" }}>{product.name}</p>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>₹{product.price}</p>
          <p style={{ margin: "2px 0", fontSize: "13px", color: "#666" }}>
            Quantity: {product.quantity}
          </p>
          <p style={{ margin: "2px 0", fontSize: "13px", color: "#666" }}>
            Color: {product.color}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <button
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #000",
            background: "#fff",
            cursor: "pointer",
          }}
          onClick={()=>navigate("/cart")}
        >
          View Cart
        </button>
        <button
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "none",
            background: "#000",
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={()=>navigate("/checkout")}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartToast;
