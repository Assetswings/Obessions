import React, { useState, useEffect } from "react";
import "./CheckoutPage.css";
import Footer from "../../components/Footer/Footer";
import { IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { fetchCheckout , processCheckout} from "./checkoutSlice";
import {
  getAddress,
  createAddress,
  deleteAddress,
  editAddress,
} from "../Profile/addressSlice";
import { fetchUserProfile } from "../Profile/profileSlice";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";

const CheckoutPage = () => {
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const dispatch = useDispatch();
   const navigate = useNavigate(); 

  const [newAddress, setNewAddress] = useState({
    state: "",
    city: "",
    landmark: "",
   
  });

  // GSTIN State
  const [gstinEnabled, setGstinEnabled] = useState(false);
  const [gstinData, setGstinData] = useState({
    registrationNumber: "",
    companyAddress: "",
  });
  const [expanded, setExpanded] = useState(false);
  const [defuktAddr, setDefultAddr] = useState();

  const { checkoutData, loading } = useSelector((state) => state.checkout);
  console.log("checkout_data----->", checkoutData);

  const { orderResponse } = useSelector((state) => state.checkout);
  console.log("responce_data--->", orderResponse )

     useEffect(() => {
     dispatch(fetchCheckout());
  }, [dispatch]);

  const {
    data: profileData,
    // loading,
    // error,
  } = useSelector((state) => state.profile);
  console.log("prifile_data---->", profileData);
  // Run when profileData changes

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const { data: addressdata } = useSelector((state) => state.address);
  useEffect(() => {
    dispatch(getAddress());
  }, [dispatch]);

  useEffect(() => {
    if (addressdata && addressdata.length > 0) {
    const defAddr = addressdata.find((addr) => addr.is_default === true);
    if (defAddr) {
    setDefultAddr(defAddr);
      }
    }
  }, [addressdata]);
    console.log("Defult Address---->", defuktAddr);
  useEffect(() => {
    document.body.style.overflow = showAddAddressModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showAddAddressModal]);

  const handleModalClick = (e, closer) => {
    if (e.target.classList.contains("modal-overlay")) {
      closer();
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleGstinChange = (e) => {
    const { name, value } = e.target;
    setGstinData((prev) => ({ ...prev, [name]: value }));
  };

    const handleGstinToggle = () => {
    setGstinEnabled((prev) => !prev);
    if (gstinEnabled) {
    // Clear data when disabled
    setGstinData({ registrationNumber: "", companyAddress: "" });
    }
    };
  const displayedAddresses = expanded ? addressdata : addressdata.slice(0, 2);

  // const handlePlaceOrder = () => {
  //   if(defuktAddr){
  //     const orderPayload = {
  //       billing_first_name: defuktAddr.first_name,
  //       billing_last_name: defuktAddr.last_name,
  //       billing_mobile: defuktAddr.mobile,
  //       billing_address: defuktAddr.address,
  //       billing_address2: defuktAddr.address2,
  //       billing_landmark: defuktAddr.landmark,
  //       billing_city: defuktAddr.city,
  //       billing_state: defuktAddr.state,
  //       billing_pincode: defuktAddr.pincode,
  //       shipping_first_name: defuktAddr.first_name,
  //       shipping_last_name: defuktAddr.last_name,
  //       shipping_mobile: defuktAddr.mobile,
  //       shipping_address: defuktAddr.address,
  //       shipping_address2: defuktAddr.address2,
  //       shipping_landmark: defuktAddr.landmark,
  //       shipping_city: defuktAddr.city,
  //       shipping_state: defuktAddr.state,
  //       shipping_pincode: defuktAddr.pincode,
  //       business_details: [
  //       { company_name: gstinData.companyAddress, gst_number: gstinData.registrationNumber }
  //     ]
  //     };
  
  //     dispatch(processCheckout(orderPayload));
  //     console.log("paylod_data",orderPayload); 
  //  if (checkoutData.status === 200){
  //   navigate("/paymentgetway", {
  //     state: { checkoutData:checkoutData ,orderPayload}
  //   });
  //  } else{
  //   alert(`${checkoutData.message}`)
  //        }
  //   } else{
  //     alert("Please Add address before continue payment")
  //   }
  //   };

  const handlePlaceOrder = () => {
    if (defuktAddr) {
      const orderPayload = {
        billing_first_name: defuktAddr.first_name,
        billing_last_name: defuktAddr.last_name,
        billing_mobile: defuktAddr.mobile,
        billing_address: defuktAddr.address,
        billing_address2: defuktAddr.address2,
        billing_landmark: defuktAddr.landmark,
        billing_city: defuktAddr.city,
        billing_state: defuktAddr.state,
        billing_pincode: defuktAddr.pincode,
        shipping_first_name: defuktAddr.first_name,
        shipping_last_name: defuktAddr.last_name,
        shipping_mobile: defuktAddr.mobile,
        shipping_address: defuktAddr.address,
        shipping_address2: defuktAddr.address2,
        shipping_landmark: defuktAddr.landmark,
        shipping_city: defuktAddr.city,
        shipping_state: defuktAddr.state,
        shipping_pincode: defuktAddr.pincode,
        business_details: [
          {
            company_name: gstinData.companyAddress,
            gst_number: gstinData.registrationNumber,
          },
        ],
      };
  
        dispatch(processCheckout(orderPayload))
        .unwrap()
        .then((res) => {
          if (res.status === 200) {
            navigate("/paymentgetway", {
              state: {
                orderResponse: res,      
                orderPayload,           
                checkoutData,         
              },
            });
          } else {
            alert(res.message);
          }
        })
        .catch((err) => {
          alert(err?.message || "Something went wrong!");
        });
    } else {
      alert("Please Add address before continue payment");
    }
  };

  return (
    <>
      <div className="root-title-chk">
        <h2 className="title_chk">Checkout</h2>
      </div>
      <div className="checkout-container_chk">
        <div className="checkout-right_ck">
          {checkoutData?.data?.items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-image">
                <img
                  className="img-cart-page"
                  src={item.product.media}
                  alt="product"
                />
              </div>
              <div className="item-details">
                <h4 className="item-title">{item.product.name}</h4>
                <p className="price_details">
                  ₹{item.product.selling_price}{" "}
                  <span className="sub-1">
                    {" "}
                    <del>₹{item.product.mrp}</del> &nbsp;
                    <span className="dis-sub">{`(-${item.product.discount}%)`}</span>{" "}
                  </span>
                </p>
                <p className="item-size">
                  Size: <u>{item.product.size}</u>
                </p>
                <p>
                  Color:{" "}
                  <span className={`color-${item.product.color.toLowerCase()}`}>
                    {item.product.color}
                  </span>
                </p>
                <p className="item-qtn">
                  Quantity: <u>{item.cart_qty}</u>
                </p>
              </div>
            </div>
          ))}
        </div>

          <div className="checkout-left_ck">
          <div className="section">
            {/* calculation */}
            <div className="price-summary">
              <div className="trackvel">
                <div className="txt_title_cal">TOTAL MRP</div>
                <div>₹{checkoutData?.data?.subtotal}</div>
              </div>
              <div className="trackvel">
                <div className="txt_title_cal">
                  COUPON [{" "}
                  <span className="coupon">
                    {checkoutData?.data?.applied_coupon[0]?.coupon_code}
                  </span>{" "}
                  ]
                </div>
                <div>-₹{checkoutData?.data?.applied_coupon[0]?.discount}</div>
              </div>
              <div className="trackvel">
                <div className="txt_title_cal">ROUND OFF</div>
                <div>₹{checkoutData?.data?.order_total_roundoff}</div>
              </div>
              <div className="trackvel">
                <div className="txt_title_cal">SHIPPING CHARGES</div>
                <div>₹{checkoutData?.data?.shipping_charges}</div>
              </div>
              <br />
              <div className="breaker_global"></div>
              <div className="trackvel">
                <div className="txt_title_cal">ORDER TOTAL</div>
                <div>₹{checkoutData?.data?.order_total}</div>
              </div>
            </div>

            <br/>
            <h4 className="title_roolt_checkout">Personal Information</h4>
            <div className="root_track">
              <div className="row">
                <input
                  type="text"
                  value={profileData?.first_name || ""}
                  placeholder="First Name"
                  className="input_checkout"
                  readOnly
                />
                <input
                  type="text"
                  value={profileData?.last_name || ""}
                  placeholder="Last Name"
                  className="input_checkout"
                  readOnly
                />
              </div>
              <div className="row">
                <input
                  type="email"
                  value={profileData?.email || ""}
                  placeholder="Email"
                  className="input_checkout"
                  readOnly
                />
                <input
                  type="tel"
                  value={profileData?.mobile ? `+91 ${profileData.mobile}` : ""}
                  placeholder="Mobile"
                  className="input_checkout"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* GSTIN Section */}
          <div className="section">
            <div className="root_promo_sector">
              <div className="check_box_gstin">
                <div>
                  <input
                    type="checkbox"
                    checked={gstinEnabled}
                    onChange={handleGstinToggle}
                  />
                </div>
                <div>
                  <h6 className="gstin_title">GSTIN for Business</h6>
                </div>
              </div>

              {gstinEnabled && (
                <div className="root_track">
                  <div className="coupon-input-container_2">
                    <input
                      type="text"
                      name="registrationNumber"
                      value={gstinData.registrationNumber}
                      onChange={handleGstinChange}
                      className="coupon-input"
                      placeholder="GSTIN Registration Number"
                    />
                  </div>

                  <div className="coupon-input-container">
                    <input
                      type="text"
                      name="companyAddress"
                      value={gstinData.companyAddress}
                      onChange={handleGstinChange}
                      className="coupon-input"
                      placeholder="Registered Company with Address"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="shipping-info-section">
            <div className="shipping-track">
              <div className="ship_info">
                <h4 >SHIPPING INFORMATION</h4>
              </div>
              <div>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="add_ads"
                >
                  ADD NEW ADDRESS
                </button>
              </div>
            </div>
            {displayedAddresses.map((addr, idx) => (
              <label key={addr.id} className="address-option">
                <input
                  type="radio"
                  name="selectedAddress"
                  value={addr.id}
                  defaultChecked={addr.is_default}
                  onClick={() => setDefultAddr(addr)}
                />
                <div className="address-details">
                  <div className="address-header">
                 
                      {addr.first_name} {addr.last_name}
               
                    <span className="address-type">{addr.address_type}</span>
                  </div>
                  <div className="address-body">
                    {addr.address}
                    {addr.address2 && `, ${addr.address2}`} <br />
                    {addr.city}, {addr.state}, {addr.pincode} <br />
                    {addr.country}
                  </div>
                </div>
              </label>
            ))}

            {addressdata.length > 2 && (
              <button
                className="show-toggle-btn"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          <div className="root_track">
            <button
              onClick={handlePlaceOrder}
             className="payment-btn">CONTINUE TO PAYMENT</button>
          </div>
          <div className="root_track">
          <p className="info-note">
            <span><Info
              size={18}
            /></span> &nbsp;If a product doesn’t meet your expectations, we’re happy to offer a refund for the product value. <br />
            Please note, a 5% deduction will be made from the total invoice value to cover partial freight and packaging costs.
          </p>
          </div>
        </div>
      </div>

      {/* Address Modal */}
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
            {/* <form>
              <label>
                PIN Code*
                <input
                  name="pin"
                  value={newAddress.pin}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                State*
                <input
                  name="state"
                  value={newAddress.state}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                City*
                <input
                  name="city"
                  value={newAddress.city}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                Flat Number*
                <input
                  name="flat"
                  value={newAddress.flat}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                Street Address*
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
              <label>
                LABEL THIS ADDRESS
                <input
                  name="lableaddresss"
                  value={newAddress.lableaddresss}
                  onChange={handleNewAddressChange}
                />
              </label>
              <button type="submit">Add Address</button>
            </form> */}
            <form
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch(createAddress(newAddress)).then((res) => {
                    if (res.meta.requestStatus === "fulfilled") {
                      dispatch(getAddress());
                      setNewAddress({
                        first_name: "",
                        last_name: "",
                        mobile: "",
                        address: "",
                        address2: "",
                        landmark: "",
                        city: "",
                        state: "",
                        pincode: "",
                      });
                      setShowAddAddressModal(false);
                    }
                  });
                }}
              >
                <label>
                  First Name
                  <input
                    name="first_name"
                    value={newAddress.first_name}
                    onChange={handleNewAddressChange}
                    required
                  />
                </label>

                <label>
                  Last Name
                  <input
                    name="last_name"
                    value={newAddress.last_name}
                    onChange={handleNewAddressChange}
                    required
                  />
                </label>
                <label>
                  Mobile Number
                  <input
                    name="mobile"
                    maxLength={10}
                    value={newAddress.mobile}
                    onChange={handleNewAddressChange}
                    required
                  />
                </label>
                <label>
                  PIN Code
                  <input
                    name="pincode"
                    value={newAddress.pincode}
                    onChange={handleNewAddressChange}
                    required
                  />
                </label>
                <label>
                  State
                  <input
                    name="state"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    required
                  />
                </label>
                <label>
                  City
                  <input
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    required
                  />
                </label>
                <label>
                  Street Address 1
                  <input
                    name="address"
                    value={newAddress.address}
                    onChange={handleNewAddressChange}
                    required
                  />
                </label>
                <label>
                  Street Address 2
                  <input
                    name="address2"
                    value={newAddress.address2}
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

      <Footer />
    </>
  );
};

export default CheckoutPage;
