import React, { useState } from 'react';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from "../../../Data/firebase";
import './ServicesForm.css';

const schema = yup.object().shape({
  serviceTitle: yup.string().required('Service Title is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .required('Price is required')
    .positive('Price must be positive')
    .integer('Price must be a whole number'),
  description: yup.string().required('Description is required'),
});


function ServicesManagement({ onServiceAdded }) {
  const [categoryInput, setCategoryInput] = useState('');
  const [category, setCategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  useEffect(() => {
    return () => {
      imagePreviews.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [imagePreviews]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const handleCategoryInputChange = (e) => {
    const input = e.target.value;
    setCategoryInput(input);
    const parts = input.split('>').map((p) => p.trim()).filter(Boolean);
    setCategory(parts[0] || '');
    setSubcategories(parts.slice(1));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const uploadedImageURLs = [];

      for (const file of imageFiles) {
        const storageRef = ref(storage, `service-images/${Date.now()}-${file.name}`);
        const uploadTask = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);
        uploadedImageURLs.push(downloadURL);
      }

      const serviceData = {
        title: data.serviceTitle,
        category,
        subcategories,
        price: data.price,
        images: uploadedImageURLs,
        description: data.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'services'), serviceData);
      if (onServiceAdded) {
        onServiceAdded({ id: docRef.id, ...serviceData });
      }

      setSubmitSuccess(true);
      reset();
      setCategoryInput('');
      setCategory('');
      setSubcategories([]);
      setImageFiles([]);
      setImagePreviews([]);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="FormAddProductAdminPageMain">
      <p className="AdminPageContentAddProductComponentTitle">Manage Services</p>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="field full-width">
          <label>Service Title</label>
          <Controller
            name="serviceTitle"
            control={control}
            render={({ field }) => <input {...field} className="InputStyleAddproduct" />}
          />
          {errors.serviceTitle && <p className="error">{errors.serviceTitle.message}</p>}
        </div>

        <div className="field full-width">
          <label>Category & Subcategories</label>
          <input
            value={categoryInput}
            onChange={handleCategoryInputChange}
            className="InputStyleAddproduct"
            placeholder="e.g. Mechanical > Diagnostics > Testing"
          />
          <div style={{ marginTop: '0.5rem' }}>
            {category && <span className="tag tag-cat">📁 {category}</span>}
            {subcategories.map((sub, idx) => (
              <span key={idx} className="tag tag-sub">🏷️ {sub}</span>
            ))}
          </div>
        </div>

        <div className="field full-width">
          <label>Price (₱)</label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => <input {...field} type="number" className="InputStyleAddproduct" />}
          />
          {errors.price && <p className="error">{errors.price.message}</p>}
        </div>

        <div className="field full-width">
          <label>Upload Image(s)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="InputStyleAddproduct"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              const previews = files.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
              }));
              setImageFiles((prev) => [...prev, ...files]);
              setImagePreviews((prev) => [...prev, ...previews]);
            }}
          />
          <div className="preview-gallery">
            {imagePreviews.map((img, idx) => (
              <div key={idx} className="preview-item">
                <img src={img.preview} alt={`Preview ${idx}`} />
                <button
                  type="button"
                  onClick={() => {
                    const updatedPreviews = [...imagePreviews];
                    const updatedFiles = [...imageFiles];
                    updatedPreviews.splice(idx, 1);
                    updatedFiles.splice(idx, 1);
                    setImagePreviews(updatedPreviews);
                    setImageFiles(updatedFiles);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="field full-width">
          <label>Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <textarea {...field} className="InputStyleAddproduct" />}
          />
          {errors.description && <p className="error">{errors.description.message}</p>}
        </div>

        <div className="row">
          <button type="submit" className="btnSubmitSaveProduct" disabled={isSubmitting}>
            <svg className="svgSaveProductButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path fill="#fff" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 
              14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 
              32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 
              288a64 64 0 1 1 0 128 64 64 0 1 1 
              0-128z"></path>
            </svg>
            {isSubmitting ? 'Saving...' : 'Save Service'}
          </button>
        </div>

        {submitSuccess && <p className="success-message">Service uploaded successfully!</p>}
        {submitError && <p className="error-message">Upload failed: {submitError}</p>}
      </form>
    </div>
  );
}

export default ServicesManagement;
