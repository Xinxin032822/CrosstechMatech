import React, { useState } from 'react';
import "./ProductManagement.css";

function ProductManagement() {
  // Example state for controlled inputs (replace/add logic as needed)
  const [productName, setProductName] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [price, setPrice] = useState('');
  const [shippingFee, setShippingFee] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [specs, setSpecs] = useState([{ title: '', value: '' }]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Handlers for specs (add/remove/change)
  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };
  const addSpec = () => setSpecs([...specs, { title: '', value: '' }]);
  const removeSpec = (index) => setSpecs(specs.filter((_, i) => i !== index));

  // Handler for image preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  return (
    <div className='FormAddProductAdminPageMain'>
      <p className='AdminPageContentAddProductComponentTitle'>Add New Product</p>
      <form className=''>
        <div className="row">
          <div className="field">
            <label htmlFor="productName">Product Name</label>
            <input
              className='InputStyleAddproduct'
              id="productName"
              value={productName}
              onChange={e => setProductName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="categoryInput">Category & Subcategories</label>
            <input
              className="InputStyleAddproduct"
              id="categoryInput"
              value={categoryInput}
              onChange={e => setCategoryInput(e.target.value)}
              placeholder="e.g. Engine Parts > Spark Plugs > Fuel Injectors"
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="price">Price</label>
            <input
              className='InputStyleAddproduct'
              type="number"
              id="price"
              placeholder='₱'
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="shippingFee">Shipping Fee</label>
            <input
              className="InputStyleAddproduct"
              type="number"
              id="shippingFee"
              placeholder="₱"
              value={shippingFee}
              onChange={e => setShippingFee(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="field full-width inputChoseFileType">
            <label htmlFor="image">Image Upload (multiple)</label>
            <input
              className="InputStyleAddproduct InputStyleAddproductImage"
              type="file"
              id="image"
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
            <label htmlFor="stock">Quantity</label>
            <input
              type="number"
              id="stock"
              className="InputStyleAddproduct"
              placeholder="Enter stock quantity"
              min="0"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="field full-width">
            <label htmlFor="description">Description</label>
            <textarea
              className='InputStyleAddproduct'
              id="description"
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
          <button type="submit" className='btnSubmitSaveProduct'>
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductManagement