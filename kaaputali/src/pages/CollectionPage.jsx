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
      <ProductGrid
        products={products}
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
