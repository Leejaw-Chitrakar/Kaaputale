import React from "react";
import ProductCard from "./ProductCard";
import "../styles/ProductGrid.css";

function ProductGrid({ products, showProductDetails }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onView={showProductDetails}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
