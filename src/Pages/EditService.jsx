import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../Data/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../Styles/EditService.css';

function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    subcategories: [],
    categoryInput: '',
    images: [],
    newImages: [],
  });

  useEffect(() => {
    async function fetchService() {
      try {
        const docRef = doc(db, 'services', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title || '',
            price: data.price || '',
            description: data.description || '',
            category: data.category || '',
            subcategories: data.subcategories || [],
            categoryInput: [data.category, ...(data.subcategories || [])].join(' > '),
            images: data.images || [],
            newImages: [],
          });
        }
      } catch (err) {
        console.error('Error fetching service:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
    }));
  };

  const removeExistingImage = (index) => {
    const updated = [...formData.images];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const removeNewImage = (index) => {
    const updated = [...formData.newImages];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, newImages: updated }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCategoryChange = (e) => {
    const input = e.target.value;
    const parts = input.split('>').map((part) => part.trim()).filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      categoryInput: input,
      category: parts[0] || '',
      subcategories: parts.slice(1),
    }));
  };

  const uploadNewImages = async () => {
    const storage = getStorage();
    const uploadedUrls = [];

    for (const file of formData.newImages) {
      const fileRef = ref(storage, `services/${id}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      uploadedUrls.push(url);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); // start saving
    try {
      const docRef = doc(db, 'services', id);

      let uploadedUrls = [];
      if (formData.newImages.length > 0) {
        uploadedUrls = await uploadNewImages();
      }

      const allImages = [...formData.images, ...uploadedUrls];

      await updateDoc(docRef, {
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        subcategories: formData.subcategories,
        images: allImages,
        updatedAt: new Date(),
      });

      navigate('/admin'); // or wherever you want to go
    } catch (err) {
      console.error('Failed to update service:', err);
    } finally {
      setSaving(false); // done saving
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="EditServiceContainer">
      <h2>Edit Service</h2>
      <form onSubmit={handleSubmit} className="EditServiceForm">

        <label htmlFor="title">Service Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Service Title"
        />

        <label htmlFor="categoryInput">Category & Subcategories</label>
        <input
          type="text"
          id="categoryInput"
          value={formData.categoryInput}
          onChange={handleCategoryChange}
          placeholder="Category > Subcategory"
        />

        <label htmlFor="price">Price (₱)</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
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

        <div className="preview-gallery">
          {formData.images.map((img, idx) => (
            <div key={`existing-${idx}`} className="preview-item">
              <img src={img} alt={`img-${idx}`} />
              <button type="button" onClick={() => removeExistingImage(idx)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          ))}
          {formData.newImages.map((file, idx) => (
            <div key={`new-${idx}`} className="preview-item">
              <img src={URL.createObjectURL(file)} alt={`new-img-${idx}`} />
              <button type="button" onClick={() => removeNewImage(idx)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className={`save-button ${saving ? 'saving' : ''}`} disabled={saving}>
          {saving ? 'Saving changes...' : 'Save Changes'}
        </button>

      </form>
    </div>
  );
}

export default EditService;
