import React from "react";
import "../styles/ProductCard.css";

function ProductCard({ product, onView }) {
  return (
    <div className="product-card" onClick={() => onView(product)}>
      <img
        className="product-image"
        src={product.imageUrl}
        alt={product.name}
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <button
          className="view-button"
          onClick={(e) => {
            e.stopPropagation();
            onView(product);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
