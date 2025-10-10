import React, { useState } from "react";
import Header from "../components/Header.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Model from "../components/Model.jsx";
import Footer from "../components/Footer.jsx";
import ContactUs from "../components/ContactUs.jsx";
import "../styles/HomePage.css";

function HomePage({ products }) {
  const [cartCount, setCartCount] = useState(0);
  const [modelProduct, setModelProduct] = useState(null);

  const handleAddToCart = () => {
    setCartCount((count) => count + 1);
  };

  const showProductDetails = (product) => {
    setModelProduct(product);
  };

  const closeModel = () => {
    setModelProduct(null);
  };

  return (
    <div className="home-page-container">
      <Header cartCount={cartCount} />
      <main className="main-content">
        <div className="container">
          <h2 className="collection-title">Our Collection</h2>
          <p className="collection-description">
            Handcrafted blossoms that bloom forever in soft, cozy wool.
          </p>
          <ProductGrid
            products={products}
            showProductDetails={showProductDetails}
            onAddToCart={handleAddToCart}
          />
        </div>
      </main>
      {modelProduct && <Model product={modelProduct} onClose={closeModel} onAddToCart={handleAddToCart} />}
      <ContactUs />
      <Footer />
    </div>
  );
}

export default HomePage;
