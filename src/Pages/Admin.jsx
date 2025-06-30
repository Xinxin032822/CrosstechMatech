import React from 'react';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../Styles/Admin.css';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

const schema = yup.object().shape({
  productName: yup.string().required('Product Name is required'),
  category: yup.string().required('Category is required'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  image: yup.mixed().required('Image is required'),
  description: yup.string().required('Description is required'),
  specification: yup.string().required('Specification is required'),
});

const ProductForm = () => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);
        
        try {
        const imageFile = data.image[0];
        const storage = getStorage();
        const storageRef = ref(storage, `product-images/${Date.now()}-${imageFile.name}`);
        const uploadTask = await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(uploadTask.ref);
        const productData = {
            productName: data.productName,
            category: data.category,
            price: data.price,
            description: data.description,
            specification: data.specification,
            imageName: downloadURL,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await addDoc(collection(db, "products"), productData);
        
        console.log("Document written with ID: ", docRef.id);
        setSubmitSuccess(true);
        reset();
        } catch (error) {
        console.error("Error adding document: ", error);
        setSubmitError(error.message);
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
            <div className="field">
            <label htmlFor="productName">Product Name</label>
            <Controller
                name="productName"
                control={control}
                render={({ field }) => <input {...field} id="productName" />}
            />
            {errors.productName && <p className="error">{errors.productName.message}</p>}
            </div>
            <div className="field">
            <label htmlFor="category">Category</label>
            <Controller
                name="category"
                control={control}
                render={({ field }) => <input {...field} id="category" />}
            />
            {errors.category && <p className="error">{errors.category.message}</p>}
            </div>
        </div>

        <div className="row">
            <div className="field">
            <label htmlFor="price">Price</label>
            <Controller
                name="price"
                control={control}
                render={({ field }) => <input {...field} type="number" id="price" />}
            />
            {errors.price && <p className="error">{errors.price.message}</p>}
            </div>
            <div className="field">
            <label htmlFor="image">Image Upload</label>
            <Controller
                name="image"
                control={control}
                render={({ field }) => <input {...field} type="file" id="image" />}
            />
            {errors.image && <p className="error">{errors.image.message}</p>}
            </div>
        </div>

        <div className="row">
            <div className="field full-width">
            <label htmlFor="description">Description</label>
            <Controller
                name="description"
                control={control}
                render={({ field }) => <textarea {...field} id="description" />}
            />
            {errors.description && <p className="error">{errors.description.message}</p>}
            </div>
        </div>

        <div className="row">
            <div className="field full-width">
            <label htmlFor="specification">Specification</label>
            <Controller
                name="specification"
                control={control}
                render={({ field }) => <textarea {...field} id="specification" />}
            />
            {errors.specification && <p className="error">{errors.specification.message}</p>}
            </div>
        </div>

        <div className="row">
            <button type="submit" className='btnSubmitSaveProduct'>
                <svg className='svgSaveProductButton' aria-hidden="true" focusable="false" data-prefix="fas" data-icon="floppy-disk" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="#fff" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg>
                Save Product
            </button>
        </div>
        </form>
    );
};



function Admin() {
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setProducts(productsData);
    };

    useEffect(() => {
        fetchProducts();
    }, []);
  return (
    <div>
        
        <div>
            <p>Admin Panel</p>
            <p>Manage products and customer inquiries</p>
        </div>
        <div>
            <ul className='ulAdminPage'>
                <div className='ulChildDivAdminPage'>
                    <svg className='SVGAdminPage' aria-hidden="true" focusable="false" data-prefix="fas" data-icon="gears" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.9 8.4 167.2 8 160.4 8h-.7c-6.8 0-13.5 .4-20.1 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM112 176a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9 16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5 9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 304a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></svg>
                    <li className='LiUlDivAdminPageMainNav'>Product Management</li>
                </div>
                <div className='ulChildDivAdminPage ulChildDivAdminPageStyle'>
                    <svg className='SVGAdminPage' aria-hidden="true" focusable="false" data-prefix="fas" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path></svg>
                    <li className='LiUlDivAdminPageMainNav'>Inquiry Management</li>
                </div>
                <div className='ulChildDivAdminPage '>
                    <img className='SVGAdminPage' src="src/assets/img/shipping-fast.svg" alt="" />
                    <li className='LiUlDivAdminPageMainNav'>Delivery Management</li>
                </div>
            </ul>
        </div>
        <div>
            <div>
                <p>Add New Product</p>
                <ProductForm />
                <div>
                    <p>Current Products</p>
                    <table className='tableAdminPage'>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.productName}</td>
                                    <td>{product.category}</td>
                                    <td>${product.price}</td>
                                    <td>
                                        {product.imageUrl && (
                                            <img 
                                                src={product.imageUrl} 
                                                alt={product.imageName} 
                                                style={{ width: '50px', height: 'auto' }}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Admin