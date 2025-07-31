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
import Loader from '../Loader/Loader';

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
  price: yup.number().required('Price is required').positive('Price must be positive'),
  image: yup.mixed().required('Image is required'),
  shippingFee: yup.number().required('Shipping Fee is required').min(0, 'Shipping fee must be zero or more'),
  description: yup.string().required('Description is required'),
});

const ProductForm = ({ onProductAdded }) => {
  const [specs, setSpecs] = useState([{ title: '', value: '' }]);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryInput, setCategoryInput] = useState('');
  const [category, setCategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const addSpec = () => setSpecs([...specs, { title: '', value: '' }]);

  const removeSpec = (index) => {
    const updated = specs.filter((_, i) => i !== index);
    setSpecs(updated);
  };

  const handleCategoryInputChange = (e) => {
    const input = e.target.value;
    setCategoryInput(input);
    const parts = input.split('>').map(p => p.trim()).filter(Boolean);
    if (parts.length > 0) {
    setCategory(parts[0]);
    setSubcategories(parts.slice(1));
    } else {
      setCategory('');
      setSubcategories([]);
    }
  };

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
        category: category,
        subcategories: subcategories,
        price: data.price,
        shippingFee: data.shippingFee,
        imageName: downloadURL,
        stock: data.stock,
        maxstock: data.stock,
        description: data.description,
        specification: specs.filter(s => s.title && s.value),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, "products"), productData);
      if (onProductAdded) {
        onProductAdded({ id: docRef.id, ...productData });
      }
      console.log("Document written with ID: ", docRef.id);
      setSubmitSuccess(true);
      setImagePreview(null);
      reset();
      setCategoryInput('');
      setCategory('');
      setSubcategories([]);
      setSpecs([{ title: '', value: '' }]);
    } catch (error) {
      console.error("Error adding document: ", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='FormAddProductAdminPageMain'>
      {isSubmitting && (
        <div className="overlay">
          <div className='overlay-conten'>
            <Loader />
          </div>
        </div>
      )}

      {submitSuccess && !isSubmitting && (
        <div className="overlay" onClick={() => setSubmitSuccess(false)}>
          <div className='overlay-conten'>
            <p className="overlay-message">Product uploaded successfully!</p>
          </div>
        </div>
      )}

      {submitError && !isSubmitting && (
        <div className="overlay" onClick={() => setSubmitError(null)}>
          <div className='overlay-conten'>
            <p className="overlay-message">Upload failed: {submitError}</p>
          </div>
        </div>
      )}

      <p className='AdminPageContentAddProductComponentTitle'>Add New Product</p>
      <form onSubmit={handleSubmit(onSubmit)} className=''>
        <div className="row">
          <div className="field">
            <label htmlFor="productName">Product Name</label>
            <Controller
              name="productName"
              control={control}
              render={({ field }) => <input className='InputStyleAddproduct' {...field} id="productName" />}
            />
            {errors.productName && <p className="error">{errors.productName.message}</p>}
          </div>

          <div className="field">
            <label htmlFor="categoryInput">Category & Subcategories</label>
            <input
              className="InputStyleAddproduct"
              value={categoryInput} 
              onChange={handleCategoryInputChange}
              placeholder="e.g. Engine Parts > Spark Plugs > Fuel Injectors"
            />
            <div style={{ marginTop: '0.5rem' }}>
              {category && <span className="tag tag-cat">📁 {category}</span>}
              {subcategories.map((sub, idx) => (
                <span key={idx} className="tag tag-sub">🏷️ {sub}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="price">Price</label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => <input className='InputStyleAddproduct' {...field} type="number" id="price" placeholder='₱' />}
            />
            {errors.price && <p className="error">{errors.price.message}</p>}
          </div>

          <div className="field">
            <label htmlFor="shippingFee">Shipping Fee</label>
            <Controller
              name="shippingFee"
              control={control}
              render={({ field }) => (
                <input className="InputStyleAddproduct" {...field} type="number" id="shippingFee" placeholder="₱" />
              )}
            />
            {errors.shippingFee && <p className="error">{errors.shippingFee.message}</p>}
          </div>
        </div>

        <div className="row">
          <div className="field full-width inputChoseFileType">
            <label htmlFor="image">Image Upload</label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    className='InputStyleAddproduct InputStyleAddproductImage'
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                        field.onChange(e.target.files);
                      }
                    }}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ marginTop: '10px', maxHeight: '200px', borderRadius: '8px', width: "auto", objectFit: "cover" }}
                    />
                  )}
                </>
              )}
            />
            {errors.image && <p className="error">{errors.image.message}</p>}
          </div>

          <div className="field full-width">
            <label htmlFor="stock">Stock / Quantity</label>
            <Controller
              name="stock"
              control={control}
              rules={{ required: 'Stock is required', min: { value: 0, message: 'Must be at least 0' } }}
              render={({ field }) => (
                <input
                  type="number"
                  id="stock"
                  className="InputStyleAddproduct"
                  placeholder="Enter stock quantity"
                  min="0"
                  {...field}
                />
              )}
            />
            {errors.stock && <p className="error">{errors.stock.message}</p>}
          </div>
        </div>

        <div className="row">
          <div className="field full-width">
            <label htmlFor="description">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <textarea className='InputStyleAddproduct' {...field} id="description" />}
            />
            {errors.description && <p className="error">{errors.description.message}</p>}
          </div>
        </div>

        <div className="row">
          <div className="field full-width">
            <label>Specifications</label>
            {specs.map((spec, index) => (
              <div key={index} className="spec-field-row">
                <input
                  type="text"
                  placeholder="Title (e.g. Engine)"
                  value={spec.title}
                  className="InputStyleAddproduct"
                  onChange={(e) => handleSpecChange(index, 'title', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Turbo V8)"
                  value={spec.value}
                  className="InputStyleAddproduct"
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                />
                <button type="button" onClick={() => removeSpec(index)}><i className="fas fa-times"></i></button>
              </div>
            ))}
            <button type="button" onClick={addSpec}><i className="fas fa-plus"></i></button>
          </div>
        </div>

        <div className="row">
          <button type="submit" className='btnSubmitSaveProduct'>
            <svg className='svgSaveProductButton' aria-hidden="true" focusable="false" data-prefix="fas" data-icon="floppy-disk" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#fff" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg>
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;