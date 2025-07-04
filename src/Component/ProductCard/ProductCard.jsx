import React from 'react';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';

function ProductCard({ image, title, description, id}) {

const navigate = useNavigate();
  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />
      <div className="product-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="product-buttons">
          <button className="inquire-btn" onClick={() => navigate('/contact')}>Inquire</button>
          <button className="buy-btn" onClick={() => navigate(`/products/${id}`)}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
