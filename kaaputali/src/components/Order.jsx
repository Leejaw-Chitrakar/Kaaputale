import React, { useState } from 'react';
import { ShoppingCart, Truck, CreditCard, CheckCircle, Smartphone, AlertTriangle, X } from 'lucide-react';
import '../styles/Order.css';
import QR from '../assets/QR(LC).png';
// import axios from 'axios'
// Mock QR Code URL from Placehold.co
const ESEWA_QR_URL = QR;

// --- Reusable Input Field Component ---
const FormInput = ({ label, id, type = 'text', value, onChange, required = true, placeholder = '' }) => (
<div className="form-group">
      <label htmlFor={id} className="form-label">
            {label} {required && <span className="required-indicator">*</span>}
      </label>
      <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      className="form-input"
      placeholder={placeholder}
      />
</div>
);

// --- Payment Option Card Component ---
const PaymentOption = ({ method, currentMethod, icon, title, description, onChange }) => {
      const isSelected = currentMethod === method;
      return (
      <div
      className={`payment-option-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onChange(method)}
      >
            <div className="payment-content">
                  <div className="payment-icon-wrapper">
                        {icon}
                  </div>
                  <div className="payment-details">
                        <h3>{title}</h3>
                        <p>{description}</p>
                  </div>
            </div>
            <input
            type="radio"
            name="paymentMethod"
            value={method}
            checked={isSelected}
            onChange={() => onChange(method)}
            className="payment-radio"
            />
      </div>
      );
};


// --- Main Application Component ---
const CheckoutForm = ({ onClose, product }) => {

      const [deliveryInfo, setDeliveryInfo] = useState({
            fullName: '',
            phone: '',
            address: '',
            district: '',
      });
      const [paymentMethod, setPaymentMethod] = useState('esewa');
      const [esewaTxnId, setEsewaTxnId] = useState('');
      const [isSubmitted, setIsSubmitted] = useState(false);
      const [errorMessage, setErrorMessage] = useState('');
      // Example list of Districts for a select/input simulation
      const nepalDistricts = ['Kathmandu', 'Lalitpur', 'Bhaktapur'];
      
      const handleChange = (e) => {
            const { name, value } = e.target;
            setDeliveryInfo(prev => ({ ...prev, [name]: value }));
      };
      
      const [order, setOrder] = useState()
      const handleSubmit = (e) => {
            axios.post('http://localhost:8080/add', {order: order})
            .then(result => location.reload())
            .catch(err => console.log(err))
            e.preventDefault();
            setErrorMessage('');
            
            // Basic validation check for all required fields
            if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.address || !deliveryInfo.district) {
                  setErrorMessage("Please fill in all required delivery information.");
                  return;
            }
            
            if (paymentMethod === 'esewa' && !esewaTxnId) {
                  setErrorMessage("Please enter the E-Sewa Transaction ID to confirm payment.");
                  return;
            }
           
           // Simulating form submission
           console.log('Order Submitted:', { deliveryInfo, paymentMethod, esewaTxnId });
           setIsSubmitted(true);
      };
      
      if (isSubmitted) {
            return (
                  <div className="order-overlay">
                        <div className="confirmation-card">
                              <CheckCircle />
                              <h2>Order Confirmed!</h2>
                              <p className="message">
                                    Thank you for your order. We've received your details and will process your delivery soon.
                                    {paymentMethod === 'esewa' && " Your E-Sewa payment is currently being verified."}
                              </p>
                              <div className="order-summary-box">
                                    <h4>Delivery To:</h4>
                                    <p>{deliveryInfo.fullName} (Tel: {deliveryInfo.phone})</p>
                                    <p>{deliveryInfo.address}, {deliveryInfo.district}, Nepal</p>
                                    <p className="payment-type">Payment: <span className="capitalize">{paymentMethod === 'esewa' ? 'E-Sewa' : 'Cash on Delivery'}</span></p>
                              </div>
                              {onClose && (
                                    <button onClick={onClose} className="submit-button mt-6">
                                          Close
                                    </button>
                              )}
                        </div>
                  </div>
            );
      }
      return (
            <div className="order-overlay">
                  <form onSubmit={handleSubmit} className="order-container">
                        {onClose && (
                              <button type="button" onClick={onClose} className="order-close">
                                    <X size={24} color="#333" />
                              </button>
                        )}
                        <h1 className="header-title">
                              <ShoppingCart />
                                    Checkout
                        </h1>
                        <p className="form-description">Complete your order with delivery and payment details.</p>
                        {errorMessage && (
                              <div className="error-message-box">
                                    <AlertTriangle className="error-icon" />
                                    <p>{errorMessage}</p>
                              </div>
                        )}

                        {/* --- MAIN GRID CONTAINER: SIDE-BY-SIDE SECTIONS (Desktop) --- */}
                        <div className="checkout-grid-container">
                              {/* 1. DELIVERY DETAILS SECTION (Left Column on Desktop) */}
                              <div className="form-section">
                                    <h2 className="section-title">
                                          <Truck />
                                          Delivery Information
                                    </h2>
                                    
                                    <FormInput
                                    label="Full Name"
                                    id="fullName"
                                    name="fullName"
                                    value={deliveryInfo.fullName}
                                    onChange={handleChange}
                                    />
                                    
                                    <FormInput
                                    label="Phone Number"
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={deliveryInfo.phone}
                                    onChange={handleChange}
                                    />

                                    <FormInput
                                    label="Street Address / Area"
                                    id="address"
                                    name="address"
                                    value={deliveryInfo.address}
                                    onChange={handleChange}
                                    />
                                    
                                    <div className="form-group">
                                          <label htmlFor="district" className="form-label">
                                                District <span className="required-indicator">*</span>
                                          </label>
                                          <select
                                          id="district"
                                          name="district"
                                          value={deliveryInfo.district}
                                          onChange={handleChange}
                                          required
                                          className="form-select"
                                          >
                                                <option value="" disabled>Select District</option>
                                                {nepalDistricts.map(district => (
                                                      <option key={district} value={district}>{district}</option>
                                                ))}
                                          </select>
                                    </div>
                              </div>
                              {/* 2. PAYMENT DETAILS SECTION (Right Column on Desktop) */}
                              <div className="form-section">
                                    <h2 className="section-title">
                                          <CreditCard />
                                          Payment Method
                                    </h2>
                                    <div className="payment-options-list">
                                          <PaymentOption
                                          method="esewa"
                                          currentMethod={paymentMethod}
                                          icon={<Smartphone className="payment-option-icon" />}
                                          title="E-Sewa (Recommended)"
                                          description="Pay instantly by scanning the QR code."
                                          onChange={setPaymentMethod}
                                          />
                                          <PaymentOption
                                          method="cod"
                                          currentMethod={paymentMethod}
                                          icon={<Truck className="payment-option-icon" />}
                                          title="Cash on Delivery (COD)"
                                          description="Pay with cash when the delivery reaches your address."
                                          onChange={setPaymentMethod}
                                          />
                                    </div>
                                    {/* Conditional Payment Content */}
                                    <div className="conditional-payment-box">
                                          {paymentMethod === 'esewa' ? (
                                                // E-Sewa Details
                                                <div>
                                                      <h4 className="payment-sub-heading esewa-heading">E-Sewa Payment Instructions (Nepal)</h4>
                                                      <div className="qr-code-wrapper">
                                                            <img
                                                            src={ESEWA_QR_URL}
                                                            alt="E-Sewa QR Code"
                                                            className="qr-code-image"
                                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200/cccccc/000000?text=QR+Error"; }}
                                                            />
                                                      </div>
                                                      <p className="payment-instructions">
                                                            <b>Scan the QR code</b> above using your E-Sewa app.
                                                            <br />
                                                            Once payment is successful, please enter the <b>Transaction ID</b> below for verification.
                                                      </p>
                                                      <FormInput
                                                      label="E-Sewa Transaction ID"
                                                      id="esewaTxnId"
                                                      name="esewaTxnId"
                                                      value={esewaTxnId}
                                                      onChange={(e) => setEsewaTxnId(e.target.value)}
                                                      placeholder="Enter 10-digit Txn ID"
                                                      required={true}
                                                      />
                                                </div>
                                                ) : (
                                                      // COD Details
                                                      <div>
                                                            <h4 className="payment-sub-heading cod-heading">Cash on Delivery (COD)</h4>
                                                            <p className="payment-instructions">
                                                                  Please keep the exact amount ready for the delivery person. There may be a small handling fee applied, which will be confirmed when we call you.
                                                            </p>
                                                      </div>
                                                )
                                          }
                                    </div>
                              </div>
                        </div>
                        <button
                        type="submit"
                        className="submit-button" onClick={handleSubmit}
                        >
                              Confirm Order
                        </button>
                  </form>
            </div>
      );
};

// Renamed from 'App' to 'CheckoutForm' for clarity as an exported component.
export default CheckoutForm;