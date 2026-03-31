import React from "react";
import "../styles/ContactUs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

function ContactUs() {
  return (
    <section className="contact-section">
      <div className="contact-centered-card">
        <h2 className="contact-title">Let's Create Together</h2>
        <p className="contact-description">
          Follow our journey on Instagram for the latest updates on our handmade treasures.
        </p>
        
        <div className="info-items-centered">
          <div className="info-item">
            <span className="info-icon"><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
            <p>Bhaktapur, Nepal</p>
          </div>
          
          <a 
            href="https://instagram.com/kaaputale" 
            target="_blank" 
            rel="noreferrer" 
            className="contact-insta-btn"
          >
            <FontAwesomeIcon icon={faInstagram} />
            <span>@kaaputale</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
