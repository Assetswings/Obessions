import React, { useState, useEffect } from "react";
import "./CheckoutPage.css";
import Footer from "../../components/Footer/Footer";
import { IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { fetchCheckout, processCheckout } from "./checkoutSlice";
import {
  getAddress,
  createAddress,
  deleteAddress,
  editAddress,
} from "../Profile/addressSlice";
import { fetchUserProfile } from "../Profile/profileSlice";
import { useNavigate } from "react-router-dom";
import { Info, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const CheckoutPage = () => {
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [newAddress, setNewAddress] = useState({
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

  // GSTIN State
  const [gstinEnabled, setGstinEnabled] = useState(false);
  const [gstinData, setGstinData] = useState({
    registrationNumber: "",
    companyAddress: "",
  });
  const [expanded, setExpanded] = useState(false);
  const [defuktAddr, setDefultAddr] = useState();

  const { checkoutData, loading } = useSelector((state) => state.checkout);
  const { orderResponse } = useSelector((state) => state.checkout);

  useEffect(() => {
    dispatch(fetchCheckout());
  }, [dispatch]);

  const { data: profileData } = useSelector((state) => state.profile);
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

  const handlePlaceOrder = () => {
    let formErrors = {};
    if (defuktAddr) {
      if (gstinEnabled) {
        if (!gstinData.registrationNumber) {
          toast.error("Please Input GSTIN Registration NO");
          formErrors.registrationNumber = "Please Input GSTIN Registration NO";
          setErrors(formErrors);
          return false;
        }
        // GSTIN Validation Regex
        const gstinRegex =
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstinRegex.test(gstinData.registrationNumber)) {
          toast.error("Please enter a valid GSTIN Registration NO");
          formErrors.registrationNumber =
            "Please enter a valid GSTIN Registration NO";
          setErrors(formErrors);
          return false;
        }
        if (!gstinData.companyAddress) {
          toast.error("Please Input Company Address");
          formErrors.companyAddress = "Please Input Company Address";
          setErrors(formErrors);
          return false;
        }
      }
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
            setErrors({});
            navigate("/paymentgetway", {
              state: {
                orderResponse: res,
                orderPayload,
                checkoutData,
              },
            });
          } else {
            alert(res.message);
            toast.success(res.message || "Item removed from cart!");
          }
        })
        .catch((err) => {
          alert(err?.message || "Something went wrong!");
        });
    } else {
      toast.error("Please Add address before continue payment");
    }
  };

  const validateAddressForm = (form) => {
    let formErrors = {};

    if (!form.first_name.trim()) {
      formErrors.first_name = "First name is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.first_name)) {
      formErrors.first_name = "Only alphabets are allowed";
    } else if (form.first_name.trim().length < 3) {
      formErrors.first_name = "First name must be at least 3 characters long";
    }

    if (!form.last_name.trim()) {
      formErrors.last_name = "Last name is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.last_name)) {
      formErrors.last_name = "Only alphabets are allowed";
    } else if (form.last_name.trim().length < 3) {
      formErrors.last_name = "Last name must be at least 3 characters long";
    }

    if (!form.mobile.trim()) {
      formErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobile)) {
      formErrors.mobile = "Enter a valid 10-digit number";
    }

    if (!form.address.trim()) {
      formErrors.address = "Address is required";
    } else if (form.address.trim().length < 5) {
      formErrors.address = "Address 1 must be at least 5 characters long";
    }

    if (!form.city.trim()) {
      formErrors.city = "City is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.city)) {
      formErrors.city = "City must contain only letters";
    }

    if (!form.state.trim()) {
      formErrors.state = "State is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.state)) {
      formErrors.state = "State must contain only letters";
    }

    if (!form.pincode.trim()) {
      formErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(form.pincode)) {
      formErrors.pincode = "Enter a valid 6-digit pincode";
    }

    if (!form.address2.trim()) {
      formErrors.address2 = "Address 2 is required";
    } else if (form.address2.trim().length < 5) {
      formErrors.address2 = "Address 2 must be at least 5 characters long";
    }

    if (!form.landmark.trim()) {
      formErrors.landmark = "landmark is required";
    } else if (form.landmark.trim().length < 5) {
      formErrors.landmark = "Landmark must be at least 5 characters long";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // ✅ valid if no errors
  };

  return (
    <>
      <ToastContainer style={{zIndex:9999999999999}}  position="top-right" autoClose={3000} />
      <div className="root-title-chk">
        <h2 className="title_chk">Checkout</h2>
      </div>
      <div className="cart_mlb">
        <span className="txt_mlb_my"> Checkout</span>
      </div>
      <div className="checkout-container_chk">
        <div className="checkout-right_ck">
          {checkoutData?.data?.items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-image">
                <img
                  className="img-cart-page pointer-crusser"
                  src={item.product.media}
                  alt="product"
                  onClick={() => navigate("/productsdetails", { state: { product: item.product?.action_url } })}
                />
              </div>
              <div className="item-details">
                <h4 className="item-title pointer-crusser" onClick={() => navigate("/productsdetails", { state: { product: item.product?.action_url } })}>{item.product.name}</h4>
                <p className="price_details">
                  ₹{item.product.selling_price}{" "}
                  {item.mrp && item.mrp !== item.selling_price && (
                    <>
                      <span className="original">₹{item.mrp}</span>
                      <span className="discount">({item.discount}% OFF)</span>
                    </>
                  )}
                  {/* <span className="sub-1">
                    {" "}
                    <del>₹{item.product.mrp}</del> &nbsp;
                    <span className="dis-sub">{`(-${item.product.discount}%)`}</span>{" "}
                  </span> */}
                </p>
                <p className="item-size">
                  Size: {item.product.size}
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
                <div className="txt_title_cal">SHIPPING CHARGES</div>
                <div>₹{checkoutData?.data?.shipping_charges}</div>
              </div>
              <div className="trackvel">
                <div className="txt_title_cal">ROUND OFF</div>
                <div>₹{checkoutData?.data?.order_total_roundoff}</div>
              </div>
              {/* <br /> */}
              <div className="breaker_global">
                <hr />
              </div>
              <div className="trackvel">
                <div className="txt_title_cal">
                  Sub Total
                </div>
                <div>
                  ₹{checkoutData?.data?.order_total}
                </div>
              </div>
            </div>

            <br />
            <h4 className="title_roolt_checkout">Personal Information</h4>
            <div className="root_track">
              <div className="row">
                <div className="per-row-input">
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
              </div>
              <div className="row">
                <div className="per-row-input">
                  <input
                    type="email"
                    value={profileData?.email || ""}
                    placeholder="Email"
                    className="input_checkout"
                    readOnly
                  />
                  <input
                    type="tel"
                    value={
                      profileData?.mobile ? `+91 ${profileData.mobile}` : ""
                    }
                    placeholder="Mobile"
                    className="input_checkout"
                    readOnly
                  />
                </div>
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
                    {errors.registrationNumber && (
                      <p className="error">{errors.registrationNumber}</p>
                    )}
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
                    {errors.companyAddress && (
                      <p className="error">{errors.companyAddress}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="shipping-info-section">
            <div className="shipping-track">
              <div className="ship_info">
                <h4>SHIPPING INFORMATION</h4>
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
            <div>
              <button onClick={handlePlaceOrder} className="payment-btn">
                CONTINUE TO PAYMENT
              </button>
            </div>
          </div>
          <div className="root_track">
            <p className="info-note">
              <span>
                <Info size={18} />
              </span>{" "}
              &nbsp;If a product doesn’t meet your expectations, we’re happy to
              offer a refund for the product value. <br />
              Please note, a 5% deduction will be made from the total invoice
              value to cover partial freight and packaging costs.
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
              onClick={() => {
                setShowAddAddressModal(false);
                setErrors({});
              }}
            >
              <IoMdClose />
            </button>
            <h3>Add New Address</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!validateAddressForm(newAddress)) return; // stop if validation fails
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
                    setErrors({});
                    toast.success("Address Added Successfully.", {
                      style: {
                        background: "#1f1f1f",
                        color: "#fff",
                        borderRadius: "0px",
                        padding: "12px 16px",
                        fontSize: "14px",
                      },
                      autoClose: 6000,
                      hideProgressBar: true,
                      closeButton: ({ closeToast }) => (
                        <X
                          size={18}
                          color="#fff"
                          onClick={closeToast}
                          style={{ cursor: "pointer" }}
                        />
                      ),
                      icon: true,
                    });
                  }
                });
              }}
            >
              <label>
                <span>
                  First Name <span className="required">*</span>
                </span>
                <input
                  name="first_name"
                  value={newAddress.first_name}
                  onChange={handleNewAddressChange}
                />
                {errors.first_name && (
                  <p className="error">{errors.first_name}</p>
                )}
              </label>

              <label>
                <span>
                  Last Name <span className="required">*</span>
                </span>
                <input
                  name="last_name"
                  value={newAddress.last_name}
                  onChange={handleNewAddressChange}
                />
                {errors.last_name && (
                  <p className="error">{errors.last_name}</p>
                )}
              </label>
              <label>
                <span>
                  Mobile Number <span className="required">*</span>
                </span>
                <input
                  name="mobile"
                  maxLength={10}
                  value={newAddress.mobile}
                  onChange={handleNewAddressChange}
                />
                {errors.mobile && <p className="error">{errors.mobile}</p>}
              </label>
              <label>
                <span>
                  PIN Code <span className="required">*</span>
                </span>
                <input
                  name="pincode"
                  value={newAddress.pincode}
                  onChange={handleNewAddressChange}
                />
                {errors.pincode && <p className="error">{errors.pincode}</p>}
              </label>
              <label>
                <span>
                  State <span className="required">*</span>
                </span>
                <input
                  name="state"
                  value={newAddress.state}
                  onChange={handleNewAddressChange}
                />
                {errors.state && <p className="error">{errors.state}</p>}
              </label>
              <label>
                <span>
                  City <span className="required">*</span>
                </span>
                <input
                  name="city"
                  value={newAddress.city}
                  onChange={handleNewAddressChange}
                />
                {errors.city && <p className="error">{errors.city}</p>}
              </label>
              <label>
                <span>
                  Street Address 1 <span className="required">*</span>
                </span>
                <input
                  name="address"
                  value={newAddress.address}
                  onChange={handleNewAddressChange}
                />
                {errors.address && <p className="error">{errors.address}</p>}
              </label>
              <label>
                <span>
                  Street Address 2 <span className="required">*</span>
                </span>
                <input
                  name="address2"
                  value={newAddress.address2}
                  onChange={handleNewAddressChange}
                />
                {errors.address2 && <p className="error">{errors.address2}</p>}
              </label>
              <label>
                <span>
                  Landmark <span className="required">*</span>
                </span>
                <input
                  name="landmark"
                  value={newAddress.landmark}
                  onChange={handleNewAddressChange}
                />
                {errors.landmark && <p className="error">{errors.landmark}</p>}
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
