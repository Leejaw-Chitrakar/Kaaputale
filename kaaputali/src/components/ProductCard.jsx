import React from "react";
import "../styles/ProductCard.css";

function ProductCard({ product, onView, onAddToCart }) {
  return (
    <div className="product-card" onClick={(e) => {
              e.stopPropagation();
              if (onView) {
                onView(product);
              }
            }}>
      <img
        className="product-image"
        src={product.imageUrl}
        alt={product.name}
      />
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
            Rs. {product.price}
          </p>
      </div>
    </div>
  );
}

export default ProductCard;
