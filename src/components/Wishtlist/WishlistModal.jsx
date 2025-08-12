import React, { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./WishlistModal.css";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist, moveToCart } from "./WishlistSlice";

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

     const handleRemove = (wishlistId) => {
     dispatch(removeFromWishlist(wishlistId))
      .unwrap()
      .then(() => {
        dispatch(fetchWishlist());
      });
      };

    const handleMoveToCart = (productId,wishlistId) => {
    dispatch(moveToCart({ product_id: productId, quantity: 1 }))
    dispatch(removeFromWishlist(wishlistId))
      .unwrap()
      .then(() => {
      dispatch(fetchWishlist());
      });
  };

  return (
    <div className="wishlist-modal-overlay">
      <div className="wishlist-modal">
        <div className="wishlist-header">
          <h3>
            Wishlist{" "}
            {!loading && <span>({items.length})</span>}
            {loading && <Skeleton width={30} height={20} />}
          </h3>
          <X onClick={onClose} className="close-icon-whst" />
        </div>

        <div className="wishlist-content">
          {/* Skeleton loader */}
          {loading &&
            Array(4)
              .fill(0)
              .map((_, idx) => (
                <div
                  className="wishlist-item"
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px 0",
                    alignItems: "center",
                    borderBottom: "1px solid #e5e5e5",
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <Skeleton
                      width={80}
                      height={80}
                      borderRadius={4}
                      baseColor="#f0f0f0"
                      highlightColor="#e6e6e6"
                    />
                  </div>
                  <div
                    className="wishlist-details"
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "80px",
                    }}
                  >
                    <div>
                      <Skeleton
                        width={150}
                        height={18}
                        style={{ marginBottom: "6px" }}
                        baseColor="#f0f0f0"
                        highlightColor="#e6e6e6"
                      />
                      <Skeleton
                        width={60}
                        height={16}
                        baseColor="#f0f0f0"
                        highlightColor="#e6e6e6"
                      />
                    </div>
                    <div
                      className="wishlist-actions"
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "8px",
                      }}
                    >
                      <Skeleton
                        width={100}
                        height={30}
                        borderRadius={4}
                        baseColor="#f0f0f0"
                        highlightColor="#e6e6e6"
                      />
                      <Skeleton
                        width={80}
                        height={30}
                        borderRadius={4}
                        baseColor="#f0f0f0"
                        highlightColor="#e6e6e6"
                      />
                    </div>
                  </div>
                </div>
              ))}

          {/* Empty wishlist */}
          {!loading && items.length === 0 && (
            <p>Your wishlist is empty.</p>
          )}
          {/* Wishlist items */}
          {!loading &&
            items.map((wishlistItem, index) => {
              const product = wishlistItem.product;
              if (!product) return null;
              return (
                <div
                  className="wishlist-item"
                  key={index}
                  style={{
                    borderBottom: "1px solid #e5e5e5",
                    padding: "12px 0",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={product.media}
                    alt={product.name}
                    style={{ width: 110, height: 119, objectFit: "cover" }}
                  />
                  <div className="wishlist-details" style={{ flex: 1 }}>
                    <div>
                      <p>{product.name}</p>
                      <span>₹{product.selling_price}</span>
                    </div>
                    <div className="wishlist-actions" style={{ marginTop: "8px" }}>
                      <button
                        className="move-to-cart"
                        onClick={() => handleMoveToCart(product.id, wishlistItem.id)}
                      >
                        MOVE TO CART
                      </button>
                      <button
                        className="move-to-cart"
                        onClick={() => handleRemove(wishlistItem.id)}
                      >
                        REMOVE
                      </button>
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
