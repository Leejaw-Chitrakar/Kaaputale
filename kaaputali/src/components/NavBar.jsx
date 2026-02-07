import React, { useState } from 'react';
import '../styles/Navbar.css';
import logo from '../assets/LOGO.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

import { Link, NavLink } from 'react-router-dom';

const NavBar = ({ cartCount = 0 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Only trigger if scroll has moved and is not at top
          if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
          
          lastScrollY.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar-custom ${!isVisible ? 'navbar-hidden' : ''}`}>
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Kaapu Tales Logo" className="brand-logo-img" />
          <span className="brand-text">कापु tales</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="nav-menu">
          <li><NavLink to="/" className="nav-link">Home</NavLink></li>
          <li><NavLink to="/collection" className="nav-link">Collection</NavLink></li>
          <li><NavLink to="/about" className="nav-link">About</NavLink></li>
          <li><NavLink to="/contact" className="nav-link">Contact</NavLink></li>
          {/* Cart Icon */}
          {/* <li className="nav-cart">
            <FontAwesomeIcon icon={faShoppingCart} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;