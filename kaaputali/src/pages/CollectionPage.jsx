import React, { useState } from "react";
import ProductGrid from "../components/ProductGrid.jsx";
import Model from "../components/Model.jsx";
import Order from "../components/Order.jsx";
import products from "../data/products";
import "../styles/HomePage.css"; // Reuse existing styles for now

function CollectionPage() {
  const [modelProduct, setModelProduct] = useState(null);
  const [showOrder, setShowOrder] = useState(false);
  const [orderProduct, setOrderProduct] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "flower", "keychain", "bookmark", "accessory"];

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(product => product.type === selectedCategory);

  const showProductDetails = (product) => {
    setModelProduct(product);
  };

  const closeModel = () => {
    setModelProduct(null);
  };

  const openOrder = (product) => {
    setOrderProduct(product || null);
    setShowOrder(true);
  };

  const closeOrder = () => {
    setShowOrder(false);
    setOrderProduct(null);
  };

  return (
    <>
      <div className="collection-page container page-fade-in" style={{ marginTop: '100px', marginBottom: '50px' }}>
        <h2 className="collection-title">Our Collection</h2>
        <p className="collection-description">
          Handcrafted blossoms that bloom forever in soft, cozy wool.
        </p>

        <div className="filter-container">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === "All" ? "All" : 
               category === "flower" ? "Flowers" :
               category === "keychain" ? "Keychains" :
               category === "bookmark" ? "Bookmarks" :
               category === "accessory" ? "Accessories" : category}
            </button>
          ))}
        </div>

        <ProductGrid
          products={filteredProducts}
          showProductDetails={showProductDetails}
        />
      </div>

    {modelProduct && (
      <Model product={modelProduct} onClose={closeModel} onShowOrder={openOrder} />
    )}
    {showOrder && (
      <div className="order-overlay">
        <div className="order-container">
          <Order onClose={closeOrder} product={orderProduct} />
        </div>
      </div>
    )}
  </>
  );
}

export default CollectionPage;
