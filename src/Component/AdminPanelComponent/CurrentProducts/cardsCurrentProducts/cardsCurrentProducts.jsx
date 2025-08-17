import React from 'react';
import { useNavigate } from 'react-router-dom';
import './cardsCurrentProducts.css';

function CardsCurrentProducts({ id, image, name, category, price, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="ccp-row">
      <div className="ccp-img-col">
        <img src={image} alt={name} className="ccp-img" />
      </div>
      <div className="ccp-info-col">
        <div className="ccp-name">{name}</div>
        <div className="ccp-category">{category}</div>
      </div>
      <div className="ccp-bottom-section">
        <div className="ccp-price-col">
          ₱{price}
        </div>
        <div className="ccp-action-col">
          <button
            className="ccp-btn ccp-edit"
            onClick={() => navigate(`/admin/edit/${id}`)}
          >
            Edit
          </button>
          <button 
            className="ccp-btn ccp-delete" 
            onClick={() => onDelete(id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardsCurrentProducts;
