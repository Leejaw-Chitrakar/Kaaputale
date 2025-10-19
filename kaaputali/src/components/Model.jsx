import React from "react";
import "../styles/Model.css";

function Model({ product, onClose }) {
  return (
    <div className="model-overlay">
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
          <img
            src={product.imageUrl}
            alt={product.name}
            className="model-image"
          />
          <div className="model-info">
            <h2 className="model-title">{product.name}</h2>
            <p className="model-description">{product.description}</p>
            {/* <div className="product-price">
              <p>
                Price: <strong>RS.{product.price}</strong>
              </p>
            </div> */}
            <div className="model-button">
              {/* <button className="buy-button">
                Buy now
              </button> */}
              {/* <button className="add-to-cart-button" onClick={() => onAddToCart && onAddToCart(product)}>
                Add to Cart
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Model;
