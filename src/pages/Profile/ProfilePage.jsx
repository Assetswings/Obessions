import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { IoMdClose } from "react-icons/io";
import { SquareCheck, SquarePen } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "./profileSlice";
import OrderHistoryPage from "../Orderhistory/OrderHistoryPage";
import API from "../../app/api";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

import {
  getAddress,
  createAddress,
  deleteAddress,
  editAddress,
  makeDefaultAddress,
} from "./addressSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [editAddressData, setEditAddressData] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSession, setOtpSession] = useState(null);
  const [dob, setDob] = useState("");

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

  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    dob: "",
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

  const { data: profileData } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const { data: addressdata } = useSelector((state) => state.address);

  useEffect(() => {
    dispatch(getAddress());
  }, [dispatch]);

  // Send OTP API
  const handleSendOtp = async () => {
    try {
      const res = await API.post("/email/send-otp", {
        email: profileData?.email,
      });

      if (res.data.status === "success") {
        setOtpSession(res.data.data); // save otp_requested_id + temp_id
        toast.success("OTP sent successfully!");
        setShowOtpModal(true); // open modal
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // Verify OTP API
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/email/verify-otp", {
        otp,
        otp_requested_id: otpSession?.otp_requested_id,
        temp_id: otpSession?.temp_id,
      });

      if (res.data.success) {
        toast.success(res.data.msg || "Verified successfully!", {
          style: {
            border: "1px solid black",
            padding: "16px",
            color: "black",
          },
          iconTheme: {
            primary: "black",
            secondary: "white",
          },
        });
        setShowOtpModal(false);
        setOtp("");
        dispatch(fetchUserProfile());
      }
    } catch (err) {
      console.log(err, "error");
      toast.error(err.response?.msg || "OTP verification failed", {
        style: {
          border: "1px solid #FF0000",
          padding: "16px",
          color: "#FF0000",
        },
        iconTheme: {
          primary: "#FF0000",
          secondary: "#FFFAEE",
        },
      });
    }
  };

  useEffect(() => {
    if (showEditModal && profileData) {
      const formattedDOB = profileData?.dob
        ? formatDateForInput(profileData.dob)
        : "";

      setEditForm({
        first_name: profileData?.first_name || "",
        last_name: profileData?.last_name || "",
        email: profileData?.email || "",
        mobile: profileData?.mobile || "",
        dob: formattedDOB,
      });
      setDob(formattedDOB);
    }
  }, [showEditModal, profileData]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));

    if (name === "dob") {
      setDob(value);
    }
  };

  const handleModalClick = (e, closer) => {
    if (e.target.classList.contains("modal-overlay")) {
      closer();
    }
  };

  const validateProfileEditForm = () => {
    let formErrors = {};

    if (!editForm.first_name.trim()) {
      formErrors.first_name = "First name is required";
    } else if (!/^[A-Za-z]+$/.test(editForm.first_name)) {
      formErrors.first_name = "Only alphabets are allowed";
    }
    if (!editForm.last_name.trim()) {
      formErrors.last_name = "Last name is required";
    } else if (!/^[A-Za-z]+$/.test(editForm.last_name)) {
      formErrors.last_name = "Only alphabets are allowed";
    }
    if (!editForm.email.trim()) {
      formErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      formErrors.email = "Enter a valid email address";
    }
    if (!editForm.mobile.trim()) {
      formErrors.mobile = "Phone number is required";
    } else if (!/^\d{10}$/.test(editForm.mobile)) {
      formErrors.mobile = "Enter a valid 10-digit number";
    }
    if (!editForm.dob) {
      formErrors.dob = "Date of birth is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // true if no errors
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

  const handleSubmitEditForm = (e) => {
    e.preventDefault();
    if (!validateProfileEditForm()) return; // stop if errors
    const updatedData = { ...editForm, dob };

    dispatch(
      updateUserProfile({
        id: profileData?.billingAddress?.id,
        data: updatedData,
      })
    ).then(() => {
      setShowEditModal(false);
      setErrors({});
    });

    dispatch(fetchUserProfile());
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Address chnage
  const handleEditAddressChange = (e) => {
    const { name, value } = e.target;
    setEditAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const deteteAddress = (id) => {
    dispatch(deleteAddress(id));
  };

  const mkdaddress = (id) => {
    dispatch(makeDefaultAddress(id));
    dispatch(getAddress());
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
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
                    onClick={() => setShowEditModal(true)}
                  >
                    <p>
                      <span>
                        <SquarePen />
                      </span>
                      <span className="edit_text"> EDIT DETAILS </span>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <strong>Name</strong>
                <div>
                  {profileData?.first_name} {profileData?.last_name}
                </div>
              </div>
              <div>
                <strong>Email</strong>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {profileData?.email}
                  {profileData?.email_verified === 0 ? (
                    <button className="verify-btn" onClick={handleSendOtp}>
                      Verify
                    </button>
                  ) : (
                    <span> ✅ email veryfied </span>
                  )}
                </div>
              </div>
              <div>
                <strong>Phone</strong>
                <div>{profileData?.mobile}</div>
              </div>
              <div>
                <strong>Date of Birth</strong>
                <div>
                  {profileData?.dob &&
                    new Date(profileData.dob)
                      .toLocaleDateString("en-GB")
                      .replaceAll("/", "-")}
                </div>
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
              {addressdata.map((item) => (
                <div className="address-list">
                  <div
                    key={item.id}
                    className={`address-card ${
                      item.is_default ? "default" : ""
                    }`}
                  >
                    <div className="address-header">
                      <span className="txt_head_add">
                        {/* {item.is_default ? "HOME (Default)" : "Address"} */}
                        {item.first_name} {item.last_name}
                      </span>
                      {item.is_default && (
                        <span className="green-tick">
                          <SquareCheck />
                        </span>
                      )}
                    </div>
                    <p className="address_title_text">
                      {item.address},{item.landmark},{item.city}, {item.state},
                      {item.pincode}
                    </p>
                    <div className="card-actions">
                      <span
                        span
                        onClick={() => {
                          setEditAddressData(item);
                          setShowEditAddressModal(true);
                        }}
                      >
                        Edit
                      </span>
                      <span onClick={() => deteteAddress(item.id)}>Remove</span>
                      {item?.is_default === true ? (
                        <span> </span>
                      ) : (
                        <span onClick={() => mkdaddress(item.id)}>
                          Make Default
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="orders-section">
              <OrderHistoryPage />
            </div>
          )}
        </div>

        {/* ✅ Edit Profile Modal */}
        {showEditModal && (
          <div
            className="modal-overlay"
            onClick={(e) => handleModalClick(e, () => setShowEditModal(false))}
          >
            <div className="side-modal">
              <button
                className="close-btn"
                onClick={() => {
                  setShowEditModal(false);
                  setErrors({});
                }}
              >
                <IoMdClose />
              </button>
              <h3>Edit Profile</h3>
              <form onSubmit={handleSubmitEditForm}>
                <label>
                  First Name
                  <input
                    name="first_name"
                    value={editForm.first_name}
                    onChange={handleEditChange}
                  />
                  {errors.first_name && (
                    <p className="error">{errors.first_name}</p>
                  )}
                </label>
                <label>
                  Last Name
                  <input
                    name="last_name"
                    value={editForm.last_name}
                    onChange={handleEditChange}
                  />
                  {errors.last_name && (
                    <p className="error">{errors.last_name}</p>
                  )}
                </label>
                <label>
                  Email
                  <input
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                  />
                  {errors.email && <p className="error">{errors.email}</p>}
                </label>
                <label>
                  Phone
                  <input
                    name="mobile"
                    value={editForm.mobile}
                    onChange={handleEditChange}
                  />
                  {errors.mobile && <p className="error">{errors.mobile}</p>}
                </label>
                <label>
                  Date of Birth
                  <input
                    type="date"
                    name="dob"
                    value={dob}
                    onChange={handleEditChange}
                  />
                  {errors.dob && <p className="error">{errors.dob}</p>}
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
                      setErrors({}); // clear errors on success
                      toast.success("Address Added Successfully.");
                    }
                  });
                }}
              >
                <label>
                 <span>First Name <span className="required">*</span></span> 
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
                  <span>Last Name <span className="required">*</span></span>
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
                  <span>Mobile Number <span className="required">*</span></span>
                  <input
                    name="mobile"
                    maxLength={10}
                    value={newAddress.mobile}
                    onChange={handleNewAddressChange}
                    
                  />
                  {errors.mobile && <p className="error">{errors.mobile}</p>}
                </label>
                <label>
                  <span>PIN Code <span className="required">*</span></span>
                  <input
                    name="pincode"
                    value={newAddress.pincode}
                    onChange={handleNewAddressChange}
                    
                  />
                  {errors.pincode && <p className="error">{errors.pincode}</p>}
                </label>
                <label>
                  <span>State <span className="required">*</span></span>
                  <input
                    name="state"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    
                  />
                  {errors.state && <p className="error">{errors.state}</p>}
                </label>
                <label>
                  <span>City <span className="required">*</span></span>
                  <input
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    
                  />
                  {errors.city && <p className="error">{errors.city}</p>}
                </label>
                <label>
                  <span>Street Address 1 <span className="required">*</span></span>
                  <input
                    name="address"
                    value={newAddress.address}
                    onChange={handleNewAddressChange}
                    
                  />
                  {errors.address && <p className="error">{errors.address}</p>}
                </label>
                <label>
                  <span>Street Address 2 <span className="required">*</span></span>
                  <input
                    name="address2"
                    value={newAddress.address2}
                    onChange={handleNewAddressChange}
                    
                  />
                  {errors.address2 && (
                    <p className="error">{errors.address2}</p>
                  )}
                </label>
                <label>
                  <span>Landmark <span className="required">*</span></span>
                  <input
                    name="landmark"
                    value={newAddress.landmark}
                    onChange={handleNewAddressChange}
                  />
                  {errors.landmark && (
                    <p className="error">{errors.landmark}</p>
                  )}
                </label>
                <button type="submit">Add Address</button>
              </form>
            </div>
          </div>
        )}
        {showEditAddressModal && (
          <div className="modal-overlay">
            <div className="side-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-btn"
                onClick={() => {
                  setShowEditAddressModal(false);
                  setErrors({});
                }}
              >
                <IoMdClose />
              </button>
              <h3>Edit Address</h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!validateAddressForm(editAddressData)) return; // stop if validation fails
                  dispatch(
                    editAddress({
                      id: editAddressData.id,
                      data: editAddressData,
                    })
                  ).then((res) => {
                    if (res.meta.requestStatus === "fulfilled") {
                      dispatch(getAddress());
                      setShowEditAddressModal(false);
                      setEditAddressData(null);
                      setErrors({});
                      toast.success("Address Updated Successfully.");
                    }
                  });
                }}
              >
                <label>
                  <span>First Name <span className="required">*</span></span> 
                  <input
                    name="first_name"
                    value={editAddressData?.first_name || ""}
                    onChange={handleEditAddressChange}
                  />
                  {errors.first_name && (
                    <p className="error">{errors.first_name}</p>
                  )}
                </label>
                <label>
                  <span>Last Name <span className="required">*</span></span>
                  <input
                    name="last_name"
                    value={editAddressData?.last_name || ""}
                    onChange={handleEditAddressChange}
                  />
                  {errors.last_name && (
                    <p className="error">{errors.last_name}</p>
                  )}
                </label>
                <label>
                  <span>Mobile Number <span className="required">*</span></span>
                  <input
                    name="mobile"
                    maxLength={10}
                    value={editAddressData?.mobile || ""}
                    onChange={handleEditAddressChange}
                  />
                  {errors.mobile && <p className="error">{errors.mobile}</p>}
                </label>
                <label>
                  <span>PIN Code <span className="required">*</span></span>
                  <input
                    name="pincode"
                    value={editAddressData?.pincode || ""}
                    onChange={handleEditAddressChange}
                  />
                  {errors.pincode && <p className="error">{errors.pincode}</p>}
                </label>
                <label>
                  <span>State <span className="required">*</span></span>
                  <input
                    name="state"
                    value={editAddressData?.state || ""}
                    onChange={handleEditAddressChange}
                  />
                  {errors.state && <p className="error">{errors.state}</p>}
                </label>
                <label>
                  <span>City <span className="required">*</span></span>
                  <input
                    name="city"
                    value={editAddressData?.city || ""}
                    onChange={handleEditAddressChange}
                  />
                  {errors.city && <p className="error">{errors.city}</p>}
                </label>
                <label>
                  <span>Street Address 1 <span className="required">*</span></span>
                  <input
                    name="address"
                    value={editAddressData?.address || ""}
                    onChange={handleEditAddressChange}
                  />
                  {errors.address && <p className="error">{errors.address}</p>}
                </label>
                <label>
                  <span>Street Address 2 <span className="required">*</span></span>
                  <input
                    name="address2"
                    value={editAddressData?.address2 || ""}
                    onChange={handleEditAddressChange}
                  />
                  {errors.address2 && (
                    <p className="error">{errors.address2}</p>
                  )}
                </label>
                <label>
                  <span>Landmark <span className="required">*</span></span>
                  <input
                    name="landmark"
                    value={editAddressData?.landmark || ""}
                    onChange={handleEditAddressChange}
                  />
                  {errors.landmark && (
                    <p className="error">{errors.landmark}</p>
                  )}
                </label>
                <button type="submit">Update Address</button>
              </form>
            </div>
          </div>
        )}
      </div>
      {showOtpModal && (
        <div className="modal-overlay" onClick={() => setShowOtpModal(false)}>
          <div className="side-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setShowOtpModal(false)}
            >
              <IoMdClose />
            </button>
            <h3>Enter OTP</h3>
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
              <button type="submit">Verify OTP</button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ProfilePage;
