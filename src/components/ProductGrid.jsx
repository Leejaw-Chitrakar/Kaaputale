import React from "react";
import ProductCard from "./ProductCard";
import "../styles/ProductGrid.css";

function ProductGrid({ products, showProductDetails, onAddToCart }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onView={showProductDetails}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
