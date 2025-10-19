import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Model from "../components/Model.jsx";
import Footer from "../components/Footer.jsx";
import ContactUs from "../components/ContactUs.jsx";
// import Orders from "../components/Order.jsx"
import "../styles/HomePage.css";
import axios from 'axios';

function HomePage({ products }) {
  const [cartCount, setCartCount] = useState(0);
  const [modelProduct, setModelProduct] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/get")
      .then((result) => setOrders(result.data))
      .catch((err) => console.log(err));
  }, []);

  const handleAddToCart = (product) => {
    setCartCount((count) => count + 1);

    // send order to server and update orders list
    axios
      .post("http://localhost:3001/add", { product })
      .then((res) => {
        // optionally append returned order or refetch
        setOrders((prev) => [...prev, res.data]);
      })
      .catch((err) => console.error("Failed to add order", err));
  };

  const showProductDetails = (product) => {
    setModelProduct(product);
  };

  const closeModel = () => {
    setModelProduct(null);
  };

  return (
    <div className="home-page-container">
      {/* <Orders /> */}
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
            // onAddToCart={handleAddToCart}
          />
        </div>
      </main>
      {/* {modelProduct && <Model product={modelProduct} onClose={closeModel} onAddToCart={handleAddToCart}/>} */}
      {modelProduct && <Model product={modelProduct} onClose={closeModel}/>}
      <ContactUs />
      <Footer />
    </div>
  );
}

export default HomePage;
