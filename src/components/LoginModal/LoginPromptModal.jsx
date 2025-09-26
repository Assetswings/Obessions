import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPromptModal.css";
import logo from "../../assets/icons/Obslogo.png";
import { X } from "lucide-react";

const LoginPromptModal = ({ onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Disable body scroll
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable scroll when modal unmounts
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = () => {
    navigate("/login");
    onClose();
  };

  return (
    <div className="login-prompt-backdrop">
      <div className="login-prompt-modal">
        <button className="close-btn-md" onClick={onClose}><X/></button>
        <img src={logo} alt="Logo" className="modal-logo" />
        <h2 className="modal-heading">Make yourself at home</h2>
        <p className="modal-subtext">
          Log in to view your wishlist, track your orders, and unlock exclusive collections.
        </p>
        <button className="login-btn" onClick={handleLogin}>LOG IN</button>
      </div>
    </div>
  );
};

export default LoginPromptModal;
