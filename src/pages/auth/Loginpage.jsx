import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp, registerUser } from "../auth/authSlice";
import Footer from "../../components/Footer/Footer";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mobile, loading } = useSelector((state) => state.auth || {});

  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(30);
  const [localMobile, setLocalMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const mobileRef = useRef(null);
  const otpRef = useRef(null);

  useEffect(() => {
     document.title = `Obsession - Sign In`;
    // Autofocus handling for each step
    if (step === 1 && mobileRef.current) {
      mobileRef.current.focus();
    } else if (step === 2 && otpRef.current) {
      otpRef.current.focus();
    }
  }, [step]);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const isValidMobile = (number) => /^[0-9]{10}$/.test(number.trim());
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSendOtp = () => {
    if (!localMobile.trim()) {
      return alert("Please enter phone number.");
    }
    if (!isValidMobile(localMobile)) {
      return alert("Mobile number must be exactly 10 digits.");
    }

    dispatch(sendOtp(localMobile)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const { otp_requested_id, temp_id } = res.payload.data;
        localStorage.setItem("otp_requested_id", otp_requested_id);
        localStorage.setItem("temp_id", temp_id);
        setStep(2);
        setTimer(30);
      } else if (res.payload?.notRegistered) {
        setStep(3);
      }
    });
  };

  const handleRegister = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!isValidEmail(email)) newErrors.email = "Enter a valid email.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    dispatch(
      registerUser({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        mobile: localMobile.trim(),
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const { otp_requested_id, temp_id } = res.payload.data;
        localStorage.setItem("otp_requested_id", otp_requested_id);
        localStorage.setItem("temp_id", temp_id);
        setStep(2);
        setTimer(30);
      }
    });
  };

  const handleVerifyOtp = () => {
    if (!otp.trim()) return alert("Please enter the OTP.");

    const otp_requested_id = localStorage.getItem("otp_requested_id");
    const temp_id = localStorage.getItem("temp_id");

    if (!otp_requested_id || !temp_id) {
      alert("Missing OTP session data. Try resending OTP.");
      return;
    }

    dispatch(verifyOtp({ otp: otp.trim(), otp_requested_id, temp_id })).then(
      (res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("Login successful!", {
            style: {
              border: "1px solid #713200",
              padding: "16px",
              color: "#713200",
            },
            iconTheme: {
              primary: "#713200",
              secondary: "#FFFAEE",
            },
            hideProgressBar: true,
            closeButton: true,
            icon: true,
          });
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        } else if (res.meta.requestStatus === "rejected") {
          const message =
            res.message ||
            res.error?.data?.message ||
            "Failed to verify OTP.";

          toast.error(message, {
            style: {
              border: "1px solid #713200",
              padding: "16px",
              color: "#713200",
            },
            iconTheme: {
              primary: "#713200",
              secondary: "#FFFAEE",
            },
            hideProgressBar: true,
            closeButton: true,
            icon: true,
          });
        }
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (step === 1) handleSendOtp();
      else if (step === 2) handleVerifyOtp();
      else if (step === 3) handleRegister();
    }
  };

  return (
    <>
      <ToastContainer style={{zIndex:9999999999999}}  position="top-right" autoClose={3000} />
      <div className="login-container">
        <div className="login-box" onKeyDown={handleKeyDown}>
          {step === 1 && (
            <>
              <div className="title_track">
                <h2>Sign In</h2>
              </div>
              <input
                ref={mobileRef}
                type="text"
                className="phone_number"
                placeholder="Phone Number"
                inputMode="numeric"
                value={localMobile}
                onChange={(e) =>
                  setLocalMobile(e.target.value.replace(/\D/g, ""))
                }
                maxLength={10}
              />
              <button className="btn-dark button_track" onClick={handleSendOtp}>
                {loading ? "Sending..." : "CONTINUE"}
              </button>
              <p className="terms">
              <a href="/tc-of-sale">Terms of Service</a> and{" "}
                <a href="/privacy-policy">Privacy Policy</a>
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <div className="title_track">
                <h2>Verification Code</h2>
              </div>
              <p>
                Code sent to <span>{mobile || localMobile}</span>{" "}
                <a href="#" className="tracker_port" onClick={() => setStep(1)}>
                  Change
                </a>
              </p>
              <input
                ref={otpRef}
                type="text"
                placeholder="Verification Code"
                value={otp}
                max={6}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className="btn-dark" onClick={handleVerifyOtp}>
                VERIFY
              </button>
              <p className="timer">
                Didn't receive code?{" "}
                {timer > 0 ? (
                  <span>00:{timer.toString().padStart(2, "0")}</span>
                ) : (
                  <a href="#" onClick={handleSendOtp}>
                    Resend OTP
                  </a>
                )}
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <div className="title_track">
                <h2>Let's Get Started</h2>
              </div>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && (
                <p className="error-text">{errors.firstName}</p>
              )}

              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && (
                <p className="error-text">{errors.lastName}</p>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}

              <input type="text" disabled value={mobile || localMobile} />
              <button className="btn-dark" onClick={handleRegister}>
                CONTINUE
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
