import React from 'react'
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import './ProductForm.css';

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
            render={({ field }) => (
                <input
                type="file"
                id="image"
                onChange={(e) => field.onChange(e.target.files)}
                />
            )}
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


export default ProductForm