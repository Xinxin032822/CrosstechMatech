import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import './CurrentServices.css';
import { useNavigate } from 'react-router-dom';


const firebaseConfig = {
  apiKey: "AIzaSyBuCMNxNKZosxsYMCQSHzxno0FwpabiTCk",
  authDomain: "crosstechmatech-20288.firebaseapp.com",
  projectId: "crosstechmatech-20288",
  storageBucket: "crosstechmatech-20288.firebasestorage.app",
  messagingSenderId: "785525729273",
  appId: "1:785525729273:web:1f2eeea3b437fa81f6bf28",
  measurementId: "G-BG0PYQ759L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function CurrentServices({ onEdit }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'services'));
        const servicesData = [];
        querySnapshot.forEach((docSnap) => {
          servicesData.push({ id: docSnap.id, ...docSnap.data() });
        });
        setServices(servicesData);
      } catch (err) {
        setError('Failed to fetch services: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, 'services', id));
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  }

  function getSortedServices() {
    let filtered = services.filter((s) => {
      const text = `${s.title} ${s.category} ${s.description}`.toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    });

    switch (sortOption) {
      case 'priceLowHigh':
        return filtered.sort((a, b) => a.price - b.price);
      case 'priceHighLow':
        return filtered.sort((a, b) => b.price - a.price);
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered; // default: no sorting
    }
  }

  const displayedServices = getSortedServices();

  if (loading) return <p>Loading services...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (displayedServices.length === 0) return <p>No services found.</p>;

  return (
    <div className="current-services-container">
      <div className="service-controls">
        <input
          type="text"
          placeholder="Search services..."
          className="service-search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="service-sort-dropdown"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="latest">Sort: Latest</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>

      <div className="services-header">
        <span>Image</span>
        <span>Title</span>
        <span>Category</span>
        <span>Price</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      {displayedServices.map((service) => (
        <div key={service.id} className="service-row">
          <div className="service-image">
            {service.images && service.images.length > 0 ? (
              <img src={service.images[0]} alt={service.title} />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>
          <div className="service-title">{service.title}</div>
          <div className="service-category">
            {service.category}
            {service.subcategories &&
              service.subcategories.length > 0 &&
              ` > ${service.subcategories.join(' > ')}`}
          </div>
          <div className="service-price">₱{service.price}</div>
          <div className="service-description">{service.description}</div>
          <div className="service-actions">
            <button onClick={() => navigate(`/admin/edit-service/${service.id}`)} className="btn-edit">
              Edit
            </button>

            <button
              onClick={() => handleDelete(service.id)}
              disabled={deletingId === service.id}
              className="btn-delete"
            >
              {deletingId === service.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CurrentServices;
