import React, { useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Model from "../components/Model.jsx";
import Order from "../components/Order.jsx";
import products from "../data/products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingHeart, faLeaf, faPalette, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/HomePage.css";

function HomePage() {
  // Feature the products
  const featuredProducts = products.filter(product => product.featured);
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

  const testimonials = [
    {
      id: 1,
      name: "Anonymous",
      text: "The handcrafted tulip I bought is absolutely stunning! It looks so real and adds such a warm touch to my desk.",
      rating: 4
    },
    {
      id: 2,
      name: "Anonymous",
      text: "I love the sustainable materials used. It feels good to buy something beautiful that is also eco-friendly.",
      rating: 5
    },
    {
      id: 3,
      name: "Anonymous",
      text: "Perfect for a Valintine's gift! Highly recommend Kaapu Tales.",
      rating: 4
    }
  ];

  const quotes = [
    "Where flowers bloom, so does hope.",
    "Happiness radiates like the fragrance from a flower.",
    "Every flower is a soul blossoming in nature.",
    "Flowers are the music of the ground.",
    "Love is the flower you've got to let grow.",
    "Deep in their roots, all flowers keep the light.",
    "To plant a garden is to believe in tomorrow."
  ];

  return (
    <>
      <div className="home-page-container page-fade-in">
      <Hero />

      {/* Featured Products Section */}
      <section className="featured-section container">
        <h2 className="section-title">Featured Collection</h2>
        <p className="section-subtitle">Our most loved handcrafted blooms.</p>
        <ProductGrid
          products={featuredProducts}
          showProductDetails={showProductDetails}
        />
        <div className="cta-container">
          <Link to="/collection" className="nav-cta-btn big-cta">View All Products</Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Why Choose Kaapu Tales?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faHandHoldingHeart} />
              </div>
              <h3>Handcrafted with Love</h3>
              <p>Every petal is carefully stitched by skilled artisans, ensuring unique and high-quality creations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faLeaf} />
              </div>
              <h3>Sustainable Materials</h3>
              <p>We use eco-friendly wool and materials to create beautiful products that are kind to the planet.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faPalette} />
              </div>
              <h3>Fully Customizable</h3>
              <p>Create a bouquet that speaks your language. Custom colors and arrangements available upon request.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section container">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon" />
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-footer">
                <h4 className="testimonial-name">- {testimonial.name}</h4>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      {/* Animated Quotes Section */}
      <section className="quote-marquee-section">
        <div className="quote-marquee-container">
          <div className="quote-track">
            {/* Duplicate the quotes to create an infinite scroll effect */}
            {[...quotes, ...quotes].map((quote, index) => (
              <div key={index} className="quote-card">
                <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon-card" />
                <p className="quote-text">{quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
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

export default HomePage;
