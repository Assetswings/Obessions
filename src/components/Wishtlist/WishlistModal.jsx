import React, { useEffect } from "react";
import "./WishlistModal.css";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "./WishlistSlice";

const WishlistModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [dispatch]);

  return (
    <div className="wishlist-modal-overlay">
      <div className="wishlist-modal">
        <div className="wishlist-header">
          <h3>Wishlist <span>({items.length})</span></h3>
          <X onClick={onClose} className="close-icon" />
        </div>

        <div className="wishlist-content">
          {loading && <p>Loading wishlist...</p>}

          {!loading && items.length === 0 && <p>Your wishlist is empty.</p>}

          {!loading && items.map((wishlistItem, index) => {
            const product = wishlistItem.product;
            if (!product) return null; // skip null product items
            return (
              <div className="wishlist-item" key={index}>
                <img src={product.media} alt={product.name} />
                <div className="wishlist-details">
                  <div>
                    <p>{product.name}</p>
                    <span>₹{product.selling_price}</span>
                  </div>
                  <div>
                    <button className="move-to-cart">MOVE TO CART</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;
