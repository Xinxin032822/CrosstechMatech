import React from 'react';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../Styles/admin.css';
import { useState } from 'react';
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import ProductForm from '../Component/ProductForm/ProductForm';
import InquiryManagement from '../Component/InquiryManagement,jsx/InquiryManagement';
import DeliveryManagement from '../Component/DeliveryManagement/DeliveryManagement';
import { AnimatePresence, motion } from 'framer-motion';
import { pageVariants, pageTransition } from "../Component/Transition/pageTransition.js";
import Loader from '../Component/Loader/Loader.jsx';
import ArchiveOrder from '../Component/ArchiveOrder/ArchiveOrder.jsx';
import Inventory from '../Component/Inventory/Inventory.jsx';
const firebaseConfig = {
  apiKey: "AIzaSyA1SaxJky2fCYkbyUDF1lfsCPROPo71-C0",
  authDomain: "crosstechmatech-aa4c1.firebaseapp.com",
  projectId: "crosstechmatech-aa4c1",
  storageBucket: "crosstechmatech-aa4c1.firebasestorage.app",
  messagingSenderId: "939097855367",
  appId: "1:939097855367:web:f38e4460453518b2bcaf22",
  measurementId: "G-9ZSELNZP54"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
function Admin() {
    const [activeNav, setActiveNav] = useState("Product Management");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
    setLoading(true);
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
        }));
        setProducts(productsData);
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        setLoading(false);
    }
    };


    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
    try {
        const productToDelete = products.find(p => p.id === id);
        if (!productToDelete) return;

        const imageUrl = productToDelete.imageName;

        const pathStart = imageUrl.indexOf("/o/") + 3;
        const pathEnd = imageUrl.indexOf("?", pathStart);
        const encodedPath = imageUrl.slice(pathStart, pathEnd);
        const fullPath = decodeURIComponent(encodedPath);

        const imageRef = storageRef(storage, fullPath);
        await deleteObject(imageRef);

        await deleteDoc(doc(db, "products", id));
        setProducts(products.filter(p => p.id !== id));
    } catch (error) {
        console.error("Error deleting product:", error);
    }
    };
    const handleProductAdded = (newProduct) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
    };

  return (
    <div className='MainDivAdminPage'>
        <div>
            <p className='AdminPanelTextMainPage'>Admin Panel</p>
            <p className='ManageProductsTextMainPage'>Manage products and customer inquiries</p>
        </div>
        <div className='MainNavAdminPage'>
            <ul className='ulAdminPage'>
                <div className={`ulChildDivAdminPage ${activeNav === 'Product Management' ? 'active' : ''}`}
                    onClick={() => setActiveNav('Product Management')}>
                    <svg className='SVGAdminPage' aria-hidden="true" focusable="false" data-prefix="fas" data-icon="gears" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.9 8.4 167.2 8 160.4 8h-.7c-6.8 0-13.5 .4-20.1 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM112 176a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9 16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5 9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 304a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></svg>
                    <li className='LiUlDivAdminPageMainNav'>Product Management</li>
                </div>
                <div    className={`ulChildDivAdminPage ulChildDivAdminPageStyle ${activeNav === 'Inquiry Management' ? 'active' : ''}`}
                        onClick={() => setActiveNav('Inquiry Management')}>
                    <svg className='SVGAdminPage' aria-hidden="true" focusable="false" data-prefix="fas" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path></svg>
                    <li className='LiUlDivAdminPageMainNav'>Inquiry Management</li>
                </div>
                <div    className={`ulChildDivAdminPage ${activeNav === 'Delivery Management' ? 'active' : ''}`}
                        onClick={() => setActiveNav('Delivery Management')}>
                    <svg className='SVGAdminPage' aria-hidden="true" focusable="false" data-prefix="fas" data-icon="truck" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></svg>
                    <li className='LiUlDivAdminPageMainNav'>Delivery Management</li>
                </div>
                <div    className={`ulChildDivAdminPage ulChildDivAdminPageStyle ${activeNav === 'Order History' ? 'active' : ''}`}
                        onClick={() => setActiveNav('Order History')}>
                    <svg className='SVGAdminPage' aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clock-rotate-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248c108.4 0 201.3-69.8 234.5-167.3c3-8.7-.5-18.2-8.6-22.7c-9.8-5.4-22.3-1-27.6 9C419.8 395 342.6 448 256 448c-106 0-192-86-192-192S150 64 256 64s192 86 192 192c0 13.3 10.7 24 24 24s24-10.7 24-24C496 119 393 8 256 8zM232 128v96c0 8.8 7.2 16 16 16h112c8.8 0 16-7.2 16-16s-7.2-16-16-16H264v-80c0-8.8-7.2-16-16-16s-16 7.2-16 16z"></path></svg>
                    <li className='LiUlDivAdminPageMainNav'>Order History</li>
                </div>
                <div className={`ulChildDivAdminPage ${activeNav === 'Inventory Tracker' ? 'active' : ''}`} onClick={() => setActiveNav('Inventory Tracker')}>
                <svg className='SVGAdminPage' aria-hidden="true" focusable="false" data-prefix="fas" data-icon="boxes" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path fill="currentColor" d="M560 288h-80v160h80c8.8 0 16-7.2 16-16V304c0-8.8-7.2-16-16-16zM368 448V288H208v160c0 8.8 7.2 16 16 16h128c8.8 0 16-7.2 16-16zM240 32h-80c-8.8 0-16 7.2-16 16v160h112V48c0-8.8-7.2-16-16-16zm272 0h-80c-8.8 0-16 7.2-16 16v160h112V48c0-8.8-7.2-16-16-16zM368 208h112c8.8 0 16-7.2 16-16V48c0-26.5-21.5-48-48-48h-80c-26.5 0-48 21.5-48 48v144c0 8.8 7.2 16 16 16zm-288 80H16c-8.8 0-16 7.2-16 16v128c0 26.5 21.5 48 48 48h80V288c0-8.8-7.2-16-16-16zM208 208h112c8.8 0 16-7.2 16-16V48c0-26.5-21.5-48-48-48h-80c-26.5 0-48 21.5-48 48v144c0 8.8 7.2 16 16 16z"/>
                </svg>
                <li className='LiUlDivAdminPageMainNav'>Inventory Tracker</li>
                </div>

            </ul>
        </div>
        <div>
            <AnimatePresence mode='wait'>

                { activeNav === 'Product Management' && (
                    <motion.div 
                    key="product"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                    className='AdminPageContentAddProductComponent'>
                        <ProductForm onProductAdded={handleProductAdded} />
                        <div className='AdminPageContentAddProductComponentTable'>
                    <p className='CurrentProductsAdminPage'>Current Products</p>

                    {loading ? (
                        <Loader/>
                    ) : (
                        <table className='tableAdminPage'>
                        <thead className='theadAdminPage'>
                            <tr>
                            <th className='theadLabelAdminPage'>Product</th>
                            <th className='theadLabelAdminPage'>Category</th>
                            <th className='theadLabelAdminPage'>Price</th>
                            <th className='theadLabelAdminPage'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='tbodyAdminPage'>
                            {products.map(product => (
                            <tr key={product.id}>
                                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {product.imageName && (
                                    <img 
                                    src={product.imageName} 
                                    alt={product.productName} 
                                    style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }}
                                    />
                                )}
                                <span>{product.productName}</span>
                                </td>
                                <td>{product.category}</td>
                                <td>₱{product.price}</td>
                                <td>
                                <button className="deleteBtn" onClick={() => handleDelete(product.id)}>Delete</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    )}
                    </div>

                    </motion.div>
                )}
                {activeNav === 'Inquiry Management' && (
                    <motion.div
                    key="inquiry"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                    >
                        <InquiryManagement/>
                    </motion.div>
                )}
                {activeNav === 'Delivery Management' && (
                    <motion.div
                    key="delivery"  
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                    >
                        <DeliveryManagement/>
                    </motion.div>
                )}
                {activeNav === 'Order History' && (
                    <motion.div
                        key="order-history"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <ArchiveOrder />
                    </motion.div>
                )}
                {activeNav === 'Inventory Tracker' && (
                    <motion.div
                        key="inventory tracker"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Inventory/>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    </div>
  )
}

export default Admin