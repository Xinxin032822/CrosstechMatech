import React, { useEffect, useState } from 'react';
import './InquiryManagement.css';
import {  collectionGroup, getDocs, deleteDoc, doc  } from 'firebase/firestore';
import { db } from '../../Data/firebase';

function InquiryManagement() {
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
    <div className="MainInquiryMessage">
      <h2 className='CustomerInquiriesInquiryManagement'>Customer Inquiries</h2>
      <table className="InquiryTable">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Message</th>
            <th>Date</th>
            <th>Respond</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.length === 0 ? (
            <tr><td colSpan="4">No inquiries found.</td></tr>
          ) : (
            inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td>{inquiry.name}<br /><span style={{ color: 'gray' }}>{inquiry.email}</span></td>
                <td>{inquiry.message}</td>
                <td>{inquiry.date}</td>
                <td>
                    <button className="RespondButton" onClick={() => handleRespond(inquiry.email, inquiry.name)}>
                        Respond
                    </button>
                    <button
                        className="DeleteButton"
                        style={{ marginLeft: "10px", backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                        onClick={() => handleDelete(inquiry.id)}
                    >
                        Delete
                    </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InquiryManagement;
