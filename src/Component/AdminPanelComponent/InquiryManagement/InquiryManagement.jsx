import React, { useState, useEffect } from 'react';
import { collectionGroup, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../Data/firebase';
import './InquiryManagement.css';
import NotFixedLoader from "../../Loader/NotFixedLoader"

function InquiryManagement() {
  const [inquiries, setInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByDate, setSortByDate] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);

        const querySnapshot = await getDocs(collectionGroup(db, 'inquiries'));
        const inquiryList = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            fullname: data.fullname,
            email: data.email,
            message: data.message,
            date: data.createdAt?.toDate
              ? data.createdAt.toDate()
              : new Date(data.createdAt.seconds * 1000),
            refPath: docSnap.ref.path,
          };
        });

        setInquiries(inquiryList);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const handleRespond = (email, name) => {
    const subject = encodeURIComponent(`Response to Your Inquiry`);
    const body = encodeURIComponent(`Hi ${name},

Thank you for reaching out to us. We appreciate your interest and the opportunity to assist you.

[Insert your response here.]

If you have any further questions or need additional information, feel free to reply to this email or contact us directly.

Best regards,  
[Your Name]  
[Your Position / CrosstechMatech]  
dcantuba_08@yahoo.com  
+63 925 777 4587`);

    const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(mailUrl, '_blank');
  };

  const handleDelete = async (inquiryId, refPath) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await deleteDoc(doc(db, refPath));
        setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
        alert('Inquiry deleted successfully.');
      } catch (error) {
        console.error('Error deleting inquiry:', error);
        alert('Failed to delete inquiry.');
      }
    }
  };

  // Search + Sort
  const filteredInquiries = inquiries
    .filter(
      (inq) =>
        inq.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.message?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortByDate === 'newest' ? b.date - a.date : a.date - b.date
    );

  return (
    <div className="inquiry-management">
      <div className="inquiry-controls">
        <input
          type="text"
          placeholder="Search inquiries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="inquiry-search"
        />
        <select
          value={sortByDate}
          onChange={(e) => setSortByDate(e.target.value)}
          className="inquiry-sort"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {loading ? (
        <div className='LoaderMainClassInquiryManagement'>
          <NotFixedLoader/>
        </div>
      ) : (
        <div className="inquiry-list">
          {filteredInquiries.map((inq) => (
            <div key={inq.id} className="inquiry-item">
              <div className="inquiry-info">
                <p className="inquiry-name">
                  {inq.fullname} <span>({inq.email})</span>
                </p>
                <p className="inquiry-message">{inq.message}</p>
                <p className="inquiry-date">{inq.date.toLocaleString()}</p>
              </div>
              <div className="inquiry-actions">
                <button
                  className="respond-btn"
                  onClick={() => handleRespond(inq.email, inq.fullname)}
                >
                  Respond
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(inq.id, inq.refPath)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filteredInquiries.length === 0 && (
            <p className="no-results">No inquiries found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default InquiryManagement;
