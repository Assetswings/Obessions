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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = "Obsession - Contact Us";
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

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.first_name.trim()) newErrors.first_name = "First name is required.";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email.";
    if (!formData.mobile.trim()) newErrors.mobile = "Phone number is required.";
    else if (!phoneRegex.test(formData.mobile))
      newErrors.mobile = "Enter a valid 10-digit number.";
    if (!formData.category) newErrors.category = "Please select a category.";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;
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
                <p>
                  <a href={`tel:${details.data?.mobile}`} className="phone-link">
                    {details.data?.mobile}
                  </a>
                </p>
              </div>
            </div>

            <div className="info-item">
              <span>
                <Mail />
              </span>
              <div>
                <strong>Send Us a Mail</strong>
                <p>
                  <a href={`mailto:${details.data?.support_email}`} className="mail-link">
                    {details.data?.support_email}
                  </a>
                </p>
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
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row two-column">
                <div>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  {errors.first_name && <p className="error-text">{errors.first_name}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                  {errors.last_name && <p className="error-text">{errors.last_name}</p>}
                </div>
              </div>

              <div className="form-row two-column">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Phone Number"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  {errors.mobile && <p className="error-text">{errors.mobile}</p>}
                </div>
              </div>

              <div className="form-row full-width">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Category</option>
                  <option value="Bulk Enquiry / Corporate Order">
                    Bulk Enquiry / Corporate Order
                  </option>
                  <option value="Order Cancellation">Order Cancellation</option>
                  <option value="Return & Exchange">Return & Exchange</option>
                  <option value="Careers">Careers</option>
                  <option value="Others">Others</option>
                </select>
                {errors.category && <p className="error-text">{errors.category}</p>}
              </div>

              <div className="form-row full-width">
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && <p className="error-text">{errors.message}</p>}
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "SEND MESSAGE"}
              </button>
            </form>
          </div>
        </section>

        <section className="help-guides">
          <h2 style={{ fontWeight: "400", fontSize: "32px" }}>Instant Help Guides</h2>
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
