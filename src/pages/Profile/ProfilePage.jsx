// ProfilePage.jsx
import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { IoMdClose } from "react-icons/io";
import { SquareCheck, SquarePen } from "lucide-react";
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

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);

  
  const [newAddress, setNewAddress] = useState({
    pin: "",
    state: "",
    city: "",
    flat: "",
    street: "",
    landmark: "",
  });

     useEffect(() => {
    if (showEditModal || showAddAddressModal || showEditAddressModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showEditModal, showAddAddressModal, showEditAddressModal]);

  const handleModalClick = (e, closer) => {
    if (e.target.classList.contains("modal-overlay")) {
      closer();
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
      <> 
        <div className="profile-container">
      <div className="tabs">
        <div className="button_group_tracker">
          {["profile", "address", "orders"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="content-wrapper">
        {activeTab === "profile" && (
          <div className="profile-section">
            <div className="set_box">
              <div>
                <h5>MY DETAILS</h5>
                <p>Update your details below to keep your account current.</p>
              </div>
              <div>
                  <div
                  className="edit-btn"
                  onClick={() => setShowEditModal(true)}>
                 <p> <span> <SquarePen   /> </span> 
                 <span className="edit_text"> EDIT DETAILS </span> 
                 </p>
                </div>
              </div>
            </div>
            <div>
              <strong>Name</strong>
              <div>John Doe</div>
            </div>
            <div>
              <strong>Email</strong>
              <div>JohnDoe@gmail.com</div>
            </div>
            <div>
              <strong>Phone</strong>
              <div>+91 123456789</div>
            </div>
            <div>
              <strong>Date of Birth</strong>
              <div>10/08/1999</div>
            </div>
          </div>
        )}

        {activeTab === "address" && (
          <div className="address-section">
            <div
              className="address-card add"
              onClick={() => setShowAddAddressModal(true)}
            >
              + Add Address
            </div>
            <div className="address-card default">
              <div className="address-header">
                <span className="txt_head_add">HOME (Default)</span>
                <span className="green-tick">
                  <SquareCheck />
                </span>
              </div>
              <p>
                44/1 Bharat Apartment 4C, 5th Main Road, Jayanagar, Bangalore
                560041, KA IND
              </p>
              <div className="card-actions">
                <span onClick={() => setShowEditAddressModal(true)}>Edit</span>
                <span>Remove</span>
              </div>
            </div>
            <div className="address-card default">
              <div className="address-header">
                <span className="txt_head_add">
                    WORK 
                </span>
              </div>
              <p>
                44/1 Bharat Apartment 4C, 5th Main Road, Jayanagar, Bangalore
                560041, KA IND
              </p>
              <div className="card-actions">
                <span onClick={() => setShowEditAddressModal(true)}>Edit</span>
                <span>Remove</span>
                <span>Make Default</span>
              </div>
            </div>
            <div className="address-card default">
              <div className="address-header">
                <span className="txt_head_add">  Business</span>
              </div>
              <p>
                44/1 Bharat Apartment 4C, 5th Main Road, Jayanagar, Bangalore
                560041, KA IND
              </p>
              <div className="card-actions">
                <span onClick={() => setShowEditAddressModal(true)}>Edit</span>
                <span>Remove</span>
                <span>Make Default</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-section">
               <div className="order-history">
      <aside className="sidebar">
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
          </div>
        )}
      </div>

      {showEditModal && (
        <div
          className="modal-overlay"
          onClick={(e) => handleModalClick(e, () => setShowEditModal(false))}
        >
          <div className="side-modal">
            <button
              className="close-btn"
              onClick={() => setShowEditModal(false)}
            >
              <IoMdClose />
            </button>
            <h3>Edit Profile</h3>
            <form>
              <label>
                First Name
                <input defaultValue="John" />
              </label>
              <label>
                Last Name
                <input defaultValue="Doe" />
              </label>
              <label>
                Email
                <input defaultValue="johndoe@gmail.com" />
              </label>
              <label>
                Phone
                <input defaultValue="1234567890" />
              </label>
              <label>
                Date of Birth
                <input type="date" defaultValue="1999-10-10" />
              </label>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {showAddAddressModal && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            handleModalClick(e, () => setShowAddAddressModal(false))
          }
        >
          <div className="side-modal">
            <button
              className="close-btn"
              onClick={() => setShowAddAddressModal(false)}
            >
              <IoMdClose />
            </button>
            <h3>Add New Address</h3>
            <form>
              <label>
                PIN Code
                <input
                  name="pin"
                  value={newAddress.pin}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                State
                <input
                  name="state"
                  value={newAddress.state}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                City
                <input
                  name="city"
                  value={newAddress.city}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                Flat Number
                <input
                  name="flat"
                  value={newAddress.flat}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                Street Address
                <input
                  name="street"
                  value={newAddress.street}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                Landmark
                <input
                  name="landmark"
                  value={newAddress.landmark}
                  onChange={handleNewAddressChange}
                />
              </label>
              <button type="submit">Add Address</button>
            </form>
          </div>
        </div>
      )}

      {showEditAddressModal && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            handleModalClick(e, () => setShowEditAddressModal(false))
          }
        >
          <div className="side-modal">
            <button
              className="close-btn"
              onClick={() => setShowEditAddressModal(false)}
            >
              <IoMdClose />
            </button>
            <h3>Edit Address</h3>
            <form>
              <label>
                PIN Code
                <input defaultValue="560041" />
              </label>
              <label>
                State
                <input defaultValue="Karnataka" />
              </label>
              <label>
                City
                <input defaultValue="Bangalore" />
              </label>
              <label>
                Flat Number
                <input defaultValue="44/1 Bharat Apartment 4C" />
              </label>
              <label>
                Street Address
                <input defaultValue="5th Main Road, Jayanagar" />
              </label>
              <label>
                Landmark
                <input defaultValue="Near Metro Station" />
              </label>
              <button type="submit">Update Address</button>
            </form>
          </div>
        </div>
      )}
    </div>
      {/* fotter section */}
  <Footer />
      </> 
  );
};

export default ProfilePage;
