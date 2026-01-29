import React, { useEffect } from "react";
import "../styles/Model.css";

function Model({ product, onClose, onShowOrder }) {
  useEffect(() => {
    // Lock scroll on mount
    document.body.style.overflow = "hidden";

    // Handle Escape key
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div className="model-overlay" onClick={(e) => {
      if (e.target.classList.contains('model-overlay')) onClose();
    }}>
      <div className="model-content">
        <button onClick={onClose} className="close-button" aria-label="Close modal">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <div className="model-body">
          <div className="model-image-container">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="model-image"
            />
          </div>
          <div className="model-info">
            <h2 className="model-title">{product.name}</h2>
            <p className="model-description">{product.description}</p>
            <div className="product-price">
              <p>
                Price: <strong>RS.{product.price}</strong>
              </p>
            </div>
            <div className="model-actions">
              {/* <button className="buy-button" onClick={() => onShowOrder && onShowOrder(product)}>
                Buy now
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Model;
