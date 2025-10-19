import React from "react";
import "../styles/ContactUs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

function ContactUs() {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-description">
          We'd love to hear from you! Whether you have a question, a custom
          order request, or just want to say hello, We are avaiable here.
        </p>
        <div className="platform-icons">
          <a
            href="https://instagram.com/kaaputale"
            target="_blank"
            aria-label="Kaaputale Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
