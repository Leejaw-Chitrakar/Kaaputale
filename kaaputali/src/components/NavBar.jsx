import React, { useState } from 'react';
import '../styles/Navbar.css';
import logo from '../assets/LOGO.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const NavBar = ({ cartCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar-custom">
      <div className="navbar-container">
        {/* Brand */}
        <a href="/" className="navbar-brand">
          <img src={logo} alt="Kaapu Tales Logo" className="brand-logo-img" />
          <span className="brand-text">कापु tales</span>
        </a>

        {/* Desktop Menu */}
        <ul className="nav-menu">
          <li><a href="#" className="nav-link">Home</a></li>
          <li><a href="#collection" className="nav-link">Collection</a></li>
          <li><a href="#about" className="nav-link">About</a></li>
          <li><a href="#contact" className="nav-link">Contact</a></li>
          <li>
            <a href="#collection" className="nav-cta-btn">Shop Now</a>
          </li>
          {/* Cart Icon */}
          <li className="nav-cart">
            <FontAwesomeIcon icon={faShoppingCart} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </li>
        </ul>

        {/* Mobile Toggle Icons */}
        <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-nav-overlay ${isOpen ? 'active' : ''}`}>
        <a href="#" className="mobile-nav-link" onClick={toggleMenu}>Home</a>
        <a href="#collection" className="mobile-nav-link" onClick={toggleMenu}>Collection</a>
        <a href="#about" className="mobile-nav-link" onClick={toggleMenu}>About</a>
        <a href="#contact" className="mobile-nav-link" onClick={toggleMenu}>Contact</a>
        <a href="#collection" className="mobile-nav-link nav-cta-btn" onClick={toggleMenu} style={{ width: 'auto', display: 'inline-block', fontSize: '1.2rem', padding: '10px 30px', color: 'white' }}>Shop Now</a>
      </div>
    </nav>
  );
};

export default NavBar;