import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Model from "../components/Model.jsx";
import Order from "../components/Order.jsx";
import Footer from "../components/Footer.jsx";
import ContactUs from "../components/ContactUs.jsx";
// import Orders from "../components/Order.jsx"
import "../styles/HomePage.css";
import axios from 'axios';
import NavBar from "../components/NavBar.jsx";

function HomePage({ products }) {
  const [cartCount, setCartCount] = useState(0);
  const [modelProduct, setModelProduct] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5173/order")
      .then((result) => setOrders(result.data))
      .catch((err) => console.log(err));
  }, []);

  // const handleAddToCart = (product) => {
  //   setCartCount((count) => count + 1);

  //   // send order to server and update orders list
  //   axios
  //     .post("http://localhost:3001/add", { product })
  //     .then((res) => {
  //       // optionally append returned order or refetch
  //       setOrders((prev) => [...prev, res.data]);
  //     })
  //     .catch((err) => console.error("Failed to add order", err));
  // };

  const showProductDetails = (product) => {
    setModelProduct(product);
  };

  const closeModel = () => {
    setModelProduct(null);
  };

  const [showOrder, setShowOrder] = useState(false);
  const [orderProduct, setOrderProduct] = useState(null);

  const openOrder = (product) => {
    setOrderProduct(product || null);
    setShowOrder(true);
  };

  const closeOrder = () => {
    setShowOrder(false);
    setOrderProduct(null);
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
      {modelProduct && <Model product={modelProduct} onClose={closeModel} onShowOrder={openOrder} />}
      {showOrder && (
        <div className="order-overlay">
          <div className="order-container">
            <Order onClose={closeOrder} product={orderProduct} />
          </div>
        </div>
      )}
      <ContactUs />
      <Footer />
    </div>
  );
}

export default HomePage;
