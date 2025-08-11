import React from 'react';
import './cardsCurrentProducts.css';

function CardsCurrentProducts({ image, name, category, price, onEdit, onDelete }) {
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
          <button className="ccp-btn ccp-edit" onClick={onEdit}>Edit</button>
          <button className="ccp-btn ccp-delete" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default CardsCurrentProducts;