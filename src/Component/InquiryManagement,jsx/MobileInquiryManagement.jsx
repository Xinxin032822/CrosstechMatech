import React, { useEffect, useState } from 'react';
import { collectionGroup, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../Data/firebase';
import './MobileInquiryManagement.css';

function MobileInquiryManagement() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const querySnapshot = await getDocs(collectionGroup(db, "inquiries"));
        const fetchedInquiries = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.fullname,
            email: data.email,
            message: data.message,
            date: new Date(data.createdAt.seconds * 1000).toLocaleDateString(),
          };
        });
        setInquiries(fetchedInquiries);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    try {
      const querySnapshot = await getDocs(collectionGroup(db, "inquiries"));
      const docToDelete = querySnapshot.docs.find((docSnap) => docSnap.id === id);

      if (docToDelete) {
        await deleteDoc(doc(db, docToDelete.ref.path));
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        alert("Inquiry deleted successfully.");
      } else {
        alert("Inquiry not found.");
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("Failed to delete the inquiry.");
    }
  };

  const handleRespond = (email, name) => {
    const subject = encodeURIComponent(`Response to your inquiry`);
    const body = encodeURIComponent(`Hi ${name},\n\nThank you for your message. Here's our response:\n\n`);
    const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(mailUrl, '_blank');
  };

  return (
    <div className="mobile-inquiry-container">
      <h2 className="mobile-inquiry-title">Customer Inquiries</h2>
      {inquiries.length === 0 ? (
        <p>No inquiries found.</p>
      ) : (
        inquiries.map((inquiry) => (
          <div key={inquiry.id} className="mobile-inquiry-card">
            <div className="mobile-inquiry-info">
              <h3>{inquiry.name}</h3>
              <p className="mobile-inquiry-email">{inquiry.email}</p>
              <p className="mobile-inquiry-message">{inquiry.message}</p>
              <p className="mobile-inquiry-date">{inquiry.date}</p>
            </div>
            <div className="mobile-inquiry-actions">
                <button
                    className="inquiry-respond-btn"
                    onClick={() => handleRespond(inquiry.email, inquiry.name)}
                >
                    Respond
                </button>
                <button
                    className="inquiry-delete-btn"
                    onClick={() => handleDelete(inquiry.id)}
                >
                    Delete
                </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MobileInquiryManagement;
