import React from "react";
import "./OrderTrackingPage.css";
import { CircleCheck , Check} from "lucide-react";

const products = [
  {
    name: "Nefais Set of 3 Pcs Storage Basket Aqua",
    color: "Green",
    price: 5215,
    quantity: 1,
    image: "https://i.ibb.co/7tmGBm27/image-324-2.png",
  },
  {
    name: "Sophia Small Foldable Laundry Basket Storage Camel",
    color: "Brown",
    price: 5215,
    quantity: 1,
    image: "https://i.ibb.co/pgNxtfr/image-8.png",
  },
];

const trackingUpdates = [
  { label: "Order Placed", time: null, status: "done", type: "major" },
  { label: "Preparing Your Order", time: null, status: "done", type: "major" },
  { label: "Shipped", time: null, status: "done", type: "major" },
  { label: "Pick-up Scheduled with the Courier", time: "May 2, 2025 at 05:30 PM", status: "done", type: "minor" },
  { label: "Package has left our facility", time: "May 3, 2025 at 05:10 PM", status: "done", type: "minor" },
  { label: "Package has reached the Carrier Location", time: "May 3, 2025 at 08:30 PM", status: "done", type: "minor" },
  { label: "Package left the shipper facility", time: "May 4, 2025 at 04:10 AM", status: "done", type: "minor" },
  { label: "Out for Delivery", time: null, status: "pending", type: "major" },
  { label: "Delivered", time: null, status: "pending", type: "major" },
];

const OrderTrackingPage = () => {
  return (
    <div className="order-tracking-container">
      <div className="order-left">
        <h2>Order Details</h2>
        <p className="delivered-msg">Order was delivered on 06th May 2025</p>

        <div className="order-info">
          <p>Order Placed : <strong>02-05-2025</strong></p>
          <p>Order ID : <strong>#SF99887766XX</strong></p>
        </div>

        {products.map((item, i) => (
          <div className="product-item" key={i}>
            <img src={item.image} alt={item.name} />
            <div className="product-details">
              <p>{item.name}</p>
              <p>Color : {item.color}</p>
              <p>₹{item.price}</p>
              <p>Quantity : {item.quantity}</p>
              <div className="actions">
                <a href="#">Buy Again</a>
                <a href="#">Exchange / Return</a>
              </div>
            </div>
          </div>
        ))}

        <div className="price-details">
          <div><span>Sub Total</span><span>₹3510</span></div>
          <div><span>COUPON <span className="coupon">[ OBSFLAT10 ]</span></span><span className="discount">-₹351</span></div>
          <div><span>Shipping Charges</span><span>₹0</span></div>
          <div className="total"><strong>Total</strong><strong>₹3159</strong></div>
        </div>
      </div>

      <div className="order-right">
        <h3>Updates :</h3>
        <div className="timeline">
          {trackingUpdates.map((step, index) => (
            <div className={`timeline-step ${step.type} ${step.status}`} key={index}>
              <div className="dot">{step.type === "major" && step.status === "done" ? <Check size={30} strokeWidth={1.5} />: ""}</div>
              <div className="line" />
              <div className="content">
                <p>{step.label}</p>
                {step.time && <span>{step.time}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
