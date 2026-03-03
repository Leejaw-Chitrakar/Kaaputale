import React, { useState } from "react";
import "../styles/ContactUs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebookF, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-glass-card">
        <div className="contact-info">
          <div>
            <h2 className="contact-title">Get in Touch</h2>
            <p className="contact-description">
              We'd love to hear from you! Whether you have a question about custom orders, pricing, or anything else, our team is ready to answer all your questions.
            </p>
          </div>
          <div className="info-items">
            <div className="info-item">
              <span className="info-icon"><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
              <p>Bhaktapur, Nepal</p>
            </div>
            <div className="info-item">
              <span className="info-icon"><FontAwesomeIcon icon={faPhone} /></span>
              <p>+977 9761751335</p>
            </div>
            {/* <div className="info-item">
              <span className="info-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
              <p>hello@kaaputale.com</p>
            </div> */}
          </div>
          <div className="social-links">
            <a href="https://instagram.com/kaaputale" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <p>Kaaputale</p>
            {/* <a href="#" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" aria-label="WhatsApp">
              <FontAwesomeIcon icon={faWhatsapp} />
            </a> */}
          </div>
        </div>

        {/* <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3 className="form-title">Send a Message</h3>

            <div className="input-group">
              <input
                type="text"
                id="name"
                className="custom-input"
                placeholder=" "
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <label htmlFor="name" className="custom-label">Your Name</label>
            </div>

            <div className="input-group">
              <input
                type="email"
                id="email"
                className="custom-input"
                placeholder=" "
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <label htmlFor="email" className="custom-label">Email Address</label>
            </div>

            <div className="input-group">
              <textarea
                id="message"
                className="custom-textarea"
                placeholder=" "
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
              <label htmlFor="message" className="custom-label">Your Message</label>
            </div>

            <button type="submit" className="contact-submit-btn">
              {submitted ? "Message Sent!" : "Send Message"}
            </button>
          </form>
        </div> */}
      </div>
    </section>
  );
}

export default ContactUs;
