import React from "react";
import "../styles/Modal.css";

function Modal({ product, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <div className="modal-body">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="modal-image"
          />
          <div className="modal-info">
            <h2 className="modal-title">{product.name}</h2>
            <p className="modal-description">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
