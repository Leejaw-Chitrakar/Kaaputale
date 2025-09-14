import React from "react";
import "../styles/Header.css";
import logo from "../assets/LOGO.png";

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="logo-title-row">
          <img src={logo} alt="LOGO" className="header-logo" />
          <h1 className="title">कापु tales</h1>
        </div>
      </div>
    </header>
  );
}

export default Header;
