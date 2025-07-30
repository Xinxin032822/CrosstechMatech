import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Data/firebase';
import '../Styles/ProductDetailMobile.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../Component/Footer/Footer';
import Loader from '../Component/Loader/Loader';

function ProductDetailMobile() {
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

  if (!product) return <Loader />;

  return (
    <div className="product-detail-mobile-container">
        <div className="product-detail-mobile-content">
            <div className="product-detail-mobile-image-container">
                <img src={product.imageName} alt={product.productName} className="product-detail-mobile-image" />
            </div>
            <div className="product-detail-mobile-info">
                <h2 className="productNameProductDetailMobilePage">{product.productName}</h2>

                <div className="specs-box">
                    <h3>Specifications</h3>
                    <div className="specs-grid-mobile">
                    {product.specification.map((spec, index) => (
                        <div className="spec-item-mobile" key={index}>
                        <span className="spec-title-mobile">{spec.title}:</span>
                        <span className="spec-value-mobile">{spec.value}</span>
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
                    <button className="inquire-button-mobile" onClick={() => navigate(`/contact`)}>
                        <i className="fas fa-envelope"></i> Inquire
                    </button>
                    <button
                    className="buy-now-button-mobile"
                    onClick={() => navigate(`/shipping/${product.id}`)}
                    >
                    <i className="fas fa-shopping-cart"></i> Buy Now
                    </button>
                    <p className='mobileAvailableProducts'>{product.quantity} available products</p>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  );
}

export default ProductDetailMobile;
