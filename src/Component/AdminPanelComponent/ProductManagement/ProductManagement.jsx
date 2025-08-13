import React, { useState } from 'react';
import { db, storage } from '../../../Data/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './ProductManagement.css';

function ProductManagement({ setActiveSection }) {
  const [productName, setProductName] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [price, setPrice] = useState('');
  const [shippingFee, setShippingFee] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [specs, setSpecs] = useState([{ title: '', value: '' }]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };
  const addSpec = () => setSpecs([...specs, { title: '', value: '' }]);
  const removeSpec = (index) => setSpecs(specs.filter((_, i) => i !== index));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !categoryInput || !price || !quantity) {
      alert('Please fill in all required fields.');
      return;
    }
    setLoading(true);

    try {
      const categoryParts = categoryInput.split('>').map(c => c.trim());
      const category = categoryParts[0] || '';
      const subcategories = categoryParts.slice(1);

      const uploadedImageURLs = [];
      for (const file of imageFiles) {
        const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedImageURLs.push(downloadURL);
      }

      const productData = {
        productName: productName,
        category: category,
        subcategories: subcategories,
        price: Number(price),
        shippingFee: Number(shippingFee),
        images: uploadedImageURLs,
        quantity: Number(quantity),
        maxstock: Number(quantity),
        description: description,
        specification: specs.filter(s => s.title && s.value),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, 'products'), productData);

      alert('✅ Product added successfully!');
      setLoading(false);

      setProductName('');
      setCategoryInput('');
      setPrice('');
      setShippingFee('');
      setQuantity('');
      setDescription('');
      setSpecs([{ title: '', value: '' }]);
      setImageFiles([]);
      setImagePreviews([]);

      if (setActiveSection) {
        setActiveSection('currentProducts');
      }

    } catch (error) {
      console.error('Error adding product:', error);
      alert('❌ Failed to add product.');
      setLoading(false);
    }
  };

  return (
    <div className='FormAddProductAdminPageMain'>
      <p className='AdminPageContentAddProductComponentTitle'>Add New Product</p>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="field">
            <label>Product Name</label>
            <input
              className='InputStyleAddproduct'
              value={productName}
              onChange={e => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Category & Subcategories</label>
            <input
              className="InputStyleAddproduct"
              value={categoryInput}
              onChange={e => setCategoryInput(e.target.value)}
              placeholder="e.g. Engine Parts > Spark Plugs > Fuel Injectors"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Price</label>
            <input
              type="number"
              className='InputStyleAddproduct'
              placeholder='₱'
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Shipping Fee</label>
            <input
              type="number"
              className="InputStyleAddproduct"
              placeholder="₱"
              value={shippingFee}
              onChange={e => setShippingFee(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="field full-width inputChoseFileType">
            <label>Image Upload (multiple)</label>
            <input
              className="InputStyleAddproduct InputStyleAddproductImage"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
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
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="field full-width">
            <label>Quantity</label>
            <input
              type="number"
              className="InputStyleAddproduct"
              min="0"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="field full-width">
            <label>Description</label>
            <textarea
              className='InputStyleAddproduct'
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
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
                  onChange={e => handleSpecChange(index, 'title', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Turbo V8)"
                  value={spec.value}
                  className="InputStyleAddproduct"
                  onChange={e => handleSpecChange(index, 'value', e.target.value)}
                />
                <button type="button" onClick={() => removeSpec(index)}>X</button>
              </div>
            ))}
            <button type="button" onClick={addSpec}>Add Spec</button>
          </div>
        </div>

        <div className="row">
          <button type="submit" className='btnSubmitSaveProduct' disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductManagement;
