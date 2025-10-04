import React, { useState, useEffect } from "react";
import "./ContactUs.css";
import Footer from "../../components/Footer/Footer";
import { Clock4, Mail, MapPinned, Phone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitContactForm,
  resetContactState,
  fetchContactDetails,
} from "./contactUsSlice";
import { Toaster, toast } from "react-hot-toast";
import helpchat from "../../assets/icons/helpchat.png";
import sizeguide from "../../assets/icons/sizeguide.png";
import styleguild from "../../assets/icons/styleguild.png";

const ContactUs = () => {
  const dispatch = useDispatch();
  const { loading, success, error, message } = useSelector(
    (state) => state.contact
  );
  const { details } = useSelector((state) => state.contact);
  console.log("Contact details:::::::;:", details);

  useEffect(() => {
    dispatch(fetchContactDetails());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    category: "",
    message: "",
  });

  // Show toast messages
  // useEffect(() => {
  //   if (success) {
  //     toast.success(message || "Form submitted successfully!");
  //     dispatch(resetContactState());
  //     setFormData({
  //       first_name: "",
  //       last_name: "",
  //       email: "",
  //       mobile: "",
  //       category: "",
  //       message: "",
  //     });
  //   }
  //   if (error) {
  //     toast.error(error);
  //   }
  // }, [success, error, message, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the thunk and unwrap the result
    dispatch(submitContactForm(formData))
      .unwrap()
      .then((res) => {
        console.log("✅ API Response (success):", res);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          mobile: "",
          category: "",
          message: "",
        });
        toast.success("message send successfully", {
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
      })
      .catch((err) => {
        toast.error("Message must be at least 30 characters long.", {
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
      });
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="contact-page">
        <section
          className="contact-hero"
          style={{ backgroundImage: `url(${details.data?.contact_image})` }}
        />

        <section className="contact-section">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Your thoughts matter to us — whether it’s about our products,
              website experience, or anything else you’d like to share.
            </p>

            <div className="info-item">
              <span>
                <Phone />
              </span>
              <div>
                <strong>Call Us</strong>
                <p>{details.data?.mobile}</p>
              </div>
            </div>

            <div className="info-item">
              <span>
                <Mail />
              </span>
              <div>
                <strong>Send Us a Mail</strong>
                <p>{details.data?.support_email}</p>
              </div>
            </div>

            <div className="info-item">
              <span>
                <Clock4 />
              </span>
              <div>
                <strong>Opening Time</strong>
                <p>{details.data?.timing}</p>
              </div>
            </div>

            <div className="info-item">
              <span>
                <MapPinned />
              </span>
              <div>
                <strong>Address</strong>
                <p>{details.data?.address}</p>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row two-column">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row two-column">
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="mobile"
                  placeholder="Phone Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row full-width">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Category</option>
                  <option value="Bulk Enquiry / Corporate Order">Bulk Enquiry / Corporate Order</option>
                  <option value="Order Cancellation">Order Cancellation</option>
                  <option value="Return & Exchange">Return & Exchange</option>
                  <option value="Careers">Careers</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="form-row full-width">
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "SEND MESSAGE"}
              </button>
            </form>
          </div>
        </section>

        <section className="help-guides">
          <h2 style={{fontWeight:"400", fontSize:"32px"}}>Instant Help Guides</h2>
          <div className="guides-container">
            <div className="guide-item">
              <img
                src={helpchat}
                alt="FAQ Icon"
              />
              <p>FAQ’s</p>
            </div>
            <div className="guide-item">
              <img
                src={sizeguide}
                alt="Size Guide Icon"
              />
              <p>SIZE GUIDE</p>
            </div>
            <div className="guide-item">
              <img
                src={styleguild}
                alt="Style Guide Icon"
              />
              <p>STYLE GUIDE</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
