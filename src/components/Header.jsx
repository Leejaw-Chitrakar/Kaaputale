import React from "react";
import "../styles/Header.css";
import logo from "../assets/LOGO.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

function Header({ cartCount = 0 }) {
  return (
    <header className="header">
      <div className="container">
        <div className="logo-title-row">
          <h1 className="title"><img src={logo} alt="LOGO" className="header-logo" />कापु tales</h1>
          <div className="cart">
            <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
            <span className="cart-count">{cartCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
