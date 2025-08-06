import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Data/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../Styles/EditProduct.css';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    shippingFee: '',
    description: '',
    category: '',
    subcategories: [],
    specification: [{ title: '', value: '' }],
    images: [],
    newImages: [],
  });

  const uploadNewImages = async () => {
    const storage = getStorage();
    const uploadedUrls = [];

    for (const file of formData.newImages) {
      const fileRef = ref(storage, `products/${id}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      uploadedUrls.push(url);
    }

    return uploadedUrls;
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages,
    }));
  };


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            productName: data.productName || '',
            price: data.price || '',
            shippingFee: data.shippingFee || '',
            quantity: data.quantity || '',
            description: data.description || '',
            categoryInput: [data.category, ...(data.subcategories || [])].join(' > '),
            category: data.category || '',
            subcategories: data.subcategories || [],
            specification: data.specification?.length ? data.specification : [{ title: '', value: '' }],
            images: data.images || [],
            newImages: [],
          });
        }
      } catch (err) {
        console.error('Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCategoryChange = (e) => {
    const input = e.target.value;
    const parts = input.split('>').map(part => part.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      categoryInput: input,
      category: parts[0] || '',
      subcategories: parts.slice(1),
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...formData.specification];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, specification: updated }));
  };

  const addSpec = () => {
    setFormData(prev => ({
      ...prev,
      specification: [...prev.specification, { title: '', value: '' }]
    }));
  };

  const removeSpec = (index) => {
    const updated = formData.specification.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, specification: updated }));
  };

  const removeImage = (index) => {
    const updated = [...formData.images];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, images: updated }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const docRef = doc(db, 'products', id);

    let uploadedImageUrls = [];
    if (formData.newImages.length > 0) {
      uploadedImageUrls = await uploadNewImages();
    }

    const allImages = [...formData.images, ...uploadedImageUrls];

    await updateDoc(docRef, {
      productName: formData.productName,
      price: formData.price,
      shippingFee: formData.shippingFee,
      quantity: formData.quantity,
      description: formData.description,
      category: formData.category,
      subcategories: formData.subcategories,
      specification: formData.specification,
      images: allImages, // ✅ use updated image array
      updatedAt: new Date()
    });

    navigate('/admin');
  } catch (err) {
    console.error('Error updating:', err);
  }
};


  if (loading) return <p>Loading...</p>;

  return (
    <div className="EditProductContainer">
  <h2>Edit Product</h2>
  <form onSubmit={handleSubmit} className="EditProductForm">

    <label htmlFor="productName">Product Name</label>
    <input
      type="text"
      id="productName"
      name="productName"
      value={formData.productName}
      onChange={handleChange}
      placeholder="Product Name"
    />

    <label htmlFor="categoryInput">Category & Subcategories</label>
    <input
      type="text"
      id="categoryInput"
      value={formData.categoryInput}
      onChange={handleCategoryChange}
      placeholder="Category > Subcategory"
    />

    <label htmlFor="price">Price</label>
    <input
      type="number"
      id="price"
      name="price"
      value={formData.price}
      onChange={handleChange}
      placeholder="Price"
    />

    <label htmlFor="shippingFee">Shipping Fee</label>
    <input
      type="number"
      id="shippingFee"
      name="shippingFee"
      value={formData.shippingFee}
      onChange={handleChange}
      placeholder="Shipping Fee"
    />

    <label htmlFor="quantity">Quantity</label>
    <input
      type="number"
      id="quantity"
      name="quantity"
      value={formData.quantity}
      onChange={handleChange}
      placeholder="Quantity"
    />

    <label htmlFor="description">Description</label>
    <textarea
      id="description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      placeholder="Description"
    />

    <label htmlFor="imageUpload">Upload New Images</label>
    <input
      type="file"
      id="imageUpload"
      multiple
      accept="image/*"
      onChange={handleImageChange}
    />

    {/* Image Preview Section (unchanged) */}
    <div className="preview-gallery">
      {formData.images.map((img, idx) => (
        <div key={`existing-${idx}`} className="preview-item">
          <img src={img} alt={`img-${idx}`} />
          <button type="button" onClick={() => removeImage(idx)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      ))}
      {formData.newImages.map((file, idx) => (
        <div key={`new-${idx}`} className="preview-item">
          <img src={URL.createObjectURL(file)} alt={`new-img-${idx}`} />
          <button
            type="button"
            onClick={() => {
              const updated = [...formData.newImages];
              updated.splice(idx, 1);
              setFormData(prev => ({ ...prev, newImages: updated }));
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      ))}
    </div>

    <label>Specifications</label>
    <div className="specifications">
      {formData.specification.map((spec, i) => (
        <div key={i} className="spec-field-row">
          <input
            type="text"
            placeholder="Title"
            value={spec.title}
            onChange={(e) => handleSpecChange(i, 'title', e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={spec.value}
            onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
          />
          <button type="button" onClick={() => removeSpec(i)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      ))}
      <button type="button" onClick={addSpec}>
        <FontAwesomeIcon icon={faPlus} /> Add Spec
      </button>
    </div>

    <button type="submit" className="save-button">
      Save Changes
    </button>
  </form>
</div>

  );
}

export default EditProduct;
