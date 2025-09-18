import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const isValidMobile = (number) => /^[0-9]{10}$/.test(number.trim());

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
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      return alert("Please fill in all registration fields.");
    }

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
          // alert("Login successful!");
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
          // navigate(-1); // go back to previous page
          setTimeout(() => {
            navigate(-1);
          }, 2000); // wait 1s before redirect
        }
      }
    );
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="login-container">
        <div className="login-box">
          {step === 1 && (
            <>
              <div className="title_track">
                <h2>Sign In</h2>
              </div>
              <input
                type="text"
                className="phone_number"
                placeholder="Phone Number"
                inputMode="numeric"
                value={localMobile}
                onChange={
                  (e) => setLocalMobile(e.target.value.replace(/\D/g, "")) // only digits allowed
                }
                maxLength={10}
              />
              <button className="btn-dark button_track" onClick={handleSendOtp}>
                {loading ? "Sending..." : "CONTINUE"}
              </button>
              <p className="terms">
                By continuing, you agree to Obsessions{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>
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
                type="text"
                placeholder="Verification Code"
                value={otp}
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
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input type="text" disabled value={mobile || localMobile} />
              <button className="btn-dark" onClick={handleRegister}>
                CONTINUE
              </button>
              <div className="skip">
                <p>
                  <a href="#" onClick={() => setStep(1)}>
                    Not now
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
