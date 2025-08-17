import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../../Data/firebase";
import { useParams } from "react-router-dom";
import "./ServicesContact.css";

function ServicesContact() {
  const { id } = useParams(); // service id from URL
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    message: "",
  });
  const [serviceTitle, setServiceTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch service title automatically
  useEffect(() => {
    const fetchService = async () => {
      try {
        const docRef = doc(db, "services", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setServiceTitle(docSnap.data().title || "");
        }
      } catch (err) {
        console.error("Error fetching service:", err);
      }
    };
    fetchService();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await addDoc(collection(db, "serviceMessages"), {
        ...formData,
        serviceTitle: serviceTitle, // auto-filled
        createdAt: serverTimestamp(),
        status: "Unread",
      });
      setSuccess("Message sent successfully!");
      setFormData({
        customerName: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="services-contact-container">
      <h2>Contact Us About: {serviceTitle || "Loading..."}</h2>

      <form className="services-contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="customerName"
          placeholder="Your Name"
          value={formData.customerName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Service title field is hidden now */}
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>

        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default ServicesContact;
