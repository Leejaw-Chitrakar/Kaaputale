import React, { useState } from "react";
import { BounceLoader } from "react-spinners";
import "../styles/ProductCard.css";

function ProductCard({ product, onView, onAddToCart }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="product-card"
      onClick={(e) => {
        e.stopPropagation();
        if (onView) {
          onView(product);
        }
      }}
    >
      <div className="image-loader-container">
        {!imageLoaded && (
          <div className="spinner-wrapper">
            <BounceLoader
              color={"lightblue"}
              loading={true}
              size={100}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
        <img
          className={`product-image ${!imageLoaded ? "hidden" : ""}`}
          src={product.imageUrl}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {/* <button
            className="view-button"
            onClick={(e) => {
              e.stopPropagation();
              onView(product);
            }}
          >
            View Details
          </button> */}
        <p className="product-price">
          Rs. {product.price}{" "}
          {product.priceNote ? `(${product.priceNote})` : ""}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
