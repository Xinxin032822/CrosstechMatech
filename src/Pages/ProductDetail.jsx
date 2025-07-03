import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Data/firebase';
import '../Styles/ProductDetail.css';
import { li } from 'framer-motion/client';
import { useNavigate } from 'react-router-dom';


function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setProduct({ id: docSnap.id, ...docSnap.data() });
        }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail-container">
        <div className='product-detail-content'>
            <div className="product-detail-image-container">
                <img src={product.imageName} alt={product.productName} className="product-detail-image" />
            </div>
            <div className='product-detail-info'>
                <h2 className='productNameProductDetailPage'>{product.productName}</h2>
                <p className="subtitle">Heavy-duty construction excavator for professional use</p>

                <div className="specs-box">
                    <h3>Specifications</h3>
                    <div className="specs-grid">
                    {product.specification.map((spec, index) => (
                        <div className="spec-item" key={index}>
                        <span className="spec-title">{spec.title}:</span>
                        <span className="spec-value">{spec.value}</span>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="description-box">
                    <h3>Description</h3>
                    <p>{product.description}</p>
                </div>

                <div className="price-box">
                    <div>
                    <span className="starting-label">Starting from</span>
                    <h2 className="price">₱{Number(product.price).toLocaleString()}</h2>
                    </div>
                    <div className="price-note">
                    <p>Flexible payment options available</p>
                    <p>Nationwide delivery included</p>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="inquire-button" onClick={() => alert('Inquiring...')}>
                        <i className="fas fa-envelope"></i> Inquire
                    </button>
                    <button
                    className="buy-now-button"
                    onClick={() => navigate(`/shipping/${product.id}`)}
                    >
                    <i className="fas fa-shopping-cart"></i> Buy Now
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default ProductDetail;
