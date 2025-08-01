import React from "react";
import "./OrderHistoryPage.css";
import { ChevronRight } from "lucide-react";
import Footer from "../../components/Footer/Footer";

const orders = [
  {
    id: "#AWB2390678",
    status: "Estimated Delivery",
    date: "Fri, 16 May",
    showTrack: true,
    items: [
      { name: "Sophia Small Foldable Laundry Basket Storage Camel", image: "https://i.ibb.co/hJkH0jfd/image-7.png", cancelable: true },
      { name: "Nefais Set of 3 Pcs Storage Basket Aqua", image: "https://i.ibb.co/C3G4gkM0/Image-Holder-3.png", cancelable: true },
      { name: "Mehari Polypropylene Shaggy Carpet Brown", image: "https://i.ibb.co/yMvvrry/Image-Holder-4.png", cancelable: true },
    ],
  },
  {
    id: "#AWB2390678",
    status: "Delivered",
    date: "Wed, 26 Mar",
    showTrack: false,
    items: [
      { name: "Alvina Polyresin Soap Dish Beige Gold", image: "https://i.ibb.co/qYFj4610/Image-Holder-5.png", cancelable: false, actions: true },
    ],
  },
  {
    id: "#AWB2390678",
    status: "Delivered",
    date: "Jan, 10 Fri",
    showTrack: false,
    items: [
      { name: "Alvina Polyresin Bath Set Silver Grey", image: "https://i.ibb.co/pvBmBJK9/Image-Holder-7.png", cancelable: false, actions: true },
      { name: "Azure Soap Dispenser Polyresin Black", image: "https://i.ibb.co/k2Bqq16T/Image-Holder-6.png", cancelable: false, actions: true },
    ],
  },
];

const OrderHistoryPage = () => {
  return (
     <> 
       <div className="order-history">
      <aside className="sidebar">
        <h2>Order History</h2>
        <div className="filters">
          <h4>Filters</h4>
          <p>ORDER STATUS</p>
          <label><input type="checkbox" /> Order Placed</label>
          <label><input type="checkbox" /> Delivered</label>
          <label><input type="checkbox" /> Cancelled</label>
          <label><input type="checkbox" /> Returned</label>
          <a href="#" className="clear-all">Clear all</a>
        </div>
      </aside>

      <main className="order-list">
        {orders.map((order, idx) => (
          <div className="order-card" key={idx}>
            <div className="order-header">
              <div><strong>{order.status}</strong><br /><span>{order.date}</span></div>
              <div>
                <span>Order ID: {order.id}</span>
                <div className="order-actions">
                  {order.showTrack && <a href="#">Track Order</a>}
                  <a href="#">View Invoice</a>
                </div>
              </div>
            </div>  

            {order.items.map((item, i) => (
              <div className="order-item" key={i}>
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <p>{item.name}</p>
                  {item.cancelable && <a href="#">Cancel Order</a>}
                  {item.actions && (
                    <div className="actions">
                      <a href="#">Buy Again</a>
                      <a href="#">Return / Exchange</a>
                    </div>
                  )}
                </div>
                <div className="arrow">
            <ChevronRight size={24} />
                </div>  
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
    <Footer />
     </>
           
  );
};

export default OrderHistoryPage;

 
