import React from "react";
import Header from "../components/Header.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Modal from "../components/Modal.jsx";
import Footer from "../components/Footer.jsx";
import ContactUs from "../components/ContactUs.jsx";
import "../styles/HomePage.css";

function HomePage({ products, modalProduct, showProductDetails, closeModal }) {
  return (
    <div className="home-page-container">
      <Header />
      <main className="main-content">
        <div className="container">
          <h2 className="collection-title">Our Collection</h2>
          <p className="collection-description">
            Handcrafted blossoms that bloom forever in soft, cozy wool.
          </p>
          <ProductGrid
            products={products}
            showProductDetails={showProductDetails}
          />
        </div>
      </main>
      {modalProduct && <Modal product={modalProduct} onClose={closeModal} />}
      <ContactUs />
      <Footer />
    </div>
  );
}

export default HomePage;
