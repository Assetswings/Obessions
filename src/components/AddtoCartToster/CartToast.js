import { CircleCheck } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import './Carttost.css';
    const CartToast = ({ product, onViewCart, onCheckout, onClose }) => {
    const navigate = useNavigate();
  return (
    <div className="root_cart" >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "8px",
          marginBottom: "10px",
        }}
      >
        <span className="icon_color">
          <CircleCheck color="#ffffffff" variant="Bold" fill="currentColor"/> &nbsp; <span style={{ color: "black", fontSize: "20px", fontFamily:"Canela Trial"}}>Added to your Cart</span>
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
            padding:"5px"
          }}
        />

        {/* Details */}
        <div style={{ flex: 1 }}>
          <span style={{ margin: "0 0 4px" }}>{product.name?.length > 40 ? product.name.slice(0, 40) + "..." : product.name}</span>
          <p style={{ margin: "4px 0", fontSize: "14px", fontFamily:"Helvetica Neue" }}>₹{product.price}</p>
          <p style={{ margin: "2px 0", fontSize: "13px", color: "#666", fontFamily:"Helvetica Neue" }}>
            Quantity: {product.quantity}
          </p>
          <p style={{ margin: "2px 0", fontSize: "13px", color: "#666", fontFamily:"Helvetica Neue" }}>
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
        <button className="view-cart-toast-button"
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
