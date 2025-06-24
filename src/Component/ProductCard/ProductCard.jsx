import React from 'react';
import './ProductCard.css';

function ProductCard({ image, title, description }) {


  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />
      <div className="product-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="product-buttons">
          <button className="inquire-btn">Inquire</button>
          <button className="buy-btn">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
