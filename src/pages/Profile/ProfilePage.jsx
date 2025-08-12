import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { IoMdClose } from "react-icons/io";
import { SquareCheck, SquarePen } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "./profileSlice";
import {
  getAddress,
  createAddress,
  deleteAddress,
  editAddress,
} from "./addressSlice";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [editAddressData, setEditAddressData] = useState(null);

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

  const dispatch = useDispatch();
  const {
    data: profileData,
    // loading,
    // error,
  } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const { data: addressdata } = useSelector((state) => state.address);

  useEffect(() => {
    dispatch(getAddress());
  }, [dispatch]);

  console.log("DATA_FROM_ADDRESS--->", addressdata);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    dob: "",
  });

  const [dob, setDob] = useState("");

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

  const handleSubmitEditForm = (e) => {
    e.preventDefault();
    const updatedData = { ...editForm, dob };

    dispatch(
      updateUserProfile({
        id: profileData?.billingAddress?.id,
        data: updatedData,
      })
    ).then(() => setShowEditModal(false));

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
    console.log("====================================");
    console.log("is--->", id);
    console.log("====================================");
    dispatch(deleteAddress(id));
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
                <div>{profileData?.email}</div>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="orders-section">
              <div>No orders found.</div>
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
                onClick={() => setShowEditModal(false)}
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
                </label>
                <label>
                  Last Name
                  <input
                    name="last_name"
                    value={editForm.last_name}
                    onChange={handleEditChange}
                  />
                </label>
                <label>
                  Email
                  <input
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                  />
                </label>
                <label>
                  Phone
                  <input
                    name="mobile"
                    value={editForm.mobile}
                    onChange={handleEditChange}
                  />
                </label>
                <label>
                  Date of Birth
                  <input
                    type="date"
                    name="dob"
                    value={dob}
                    onChange={handleEditChange}
                  />
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

              <form
                onSubmit={(e) => {
                  e.preventDefault();
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
                    }
                  });
                }}
              >
                <label>
                  First Name
                  <input
                    name="first_name"
                    value={editAddressData?.first_name || ""}
                    onChange={handleEditAddressChange}
                  />
                </label>
                <label>
                  Last Name
                  <input
                    name="last_name"
                    value={editAddressData?.last_name || ""}
                    onChange={handleEditAddressChange}
                  />
                </label>
                <label>
                  Mobile Number
                  <input
                    name="mobile"
                    value={editAddressData?.mobile || ""}
                    onChange={handleEditAddressChange}
                  />
                </label>
                <label>
                  PIN Code
                  <input
                    name="pincode"
                    value={editAddressData?.pincode || ""}
                    onChange={handleEditAddressChange}
                  />
                </label>
                <label>
                  State
                  <input
                    name="state"
                    value={editAddressData?.state || ""}
                    onChange={handleEditAddressChange}
                  />
                </label>
                <label>
                  City
                  <input
                    name="city"
                    value={editAddressData?.city || ""}
                    onChange={handleEditAddressChange}
                  />
                </label>
                <label>
                  Street Address 1
                  <input
                    name="address"
                    value={editAddressData?.address || ""}
                    onChange={handleEditAddressChange}
                  />
                </label>
                <label>
                  Street Address 2
                  <input
                    name="address2"
                    value={editAddressData?.address2 || ""}
                    onChange={handleEditAddressChange}
                  />
                </label>
                <label>
                  Landmark
                  <input
                    name="landmark"
                    value={editAddressData?.landmark || ""}
                    onChange={handleEditAddressChange}
                  />
                </label>
                <button type="submit">Update Address</button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
