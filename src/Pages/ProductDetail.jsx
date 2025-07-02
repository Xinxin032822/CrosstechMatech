import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Data/firebase';
import '../Styles/ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

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
                <div>
                    <h2>{product.productName}</h2>
                </div>
                <div>
                    <p>{product.specification}</p>
                </div>
                <div>
                    <p>{product.description}</p>
                </div>
                <div>
                    <p>Price: ₱{product.price}</p>
                </div>
                <div>
                    <button className="inquire-button" onClick={() => alert('Inquiring...')}>
                        Inquire
                    </button>
                    <button className="buy-now-button" onClick={() => alert('Buying...')}>
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default ProductDetail;
