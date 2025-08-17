import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../Data/firebase";
import { motion } from "framer-motion";
import "./ServicesMessages.css";

function ServicesMessages() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "serviceMessages"), (snapshot) => {
      const msgs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setMessages(msgs);
    });
    return () => unsub();
  }, []);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || msg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const markAsRead = async (id) => {
    await updateDoc(doc(db, "serviceMessages", id), { status: "Read" });
  };

  const markAsResolved = async (id) => {
    await updateDoc(doc(db, "serviceMessages", id), { status: "Resolved" });
  };

  const archiveMessage = async (id) => {
    await updateDoc(doc(db, "serviceMessages", id), { status: "Archived" });
  };

  const respondToEmail = (email, subject = "Response to your service request") => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <div className="services-messages-container">
      <h2>Service Messages</h2>

      <div className="services-messages-controls">
        <input
          type="text"
          placeholder="Search by customer, service, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
          <option value="Resolved">Resolved</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="services-messages-list">
        {filteredMessages.length === 0 ? (
          <p className="no-messages">No messages found.</p>
        ) : (
          filteredMessages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`message-card ${msg.status?.toLowerCase()}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-header">
                <strong>{msg.customerName}</strong>
                <span className="status">{msg.status || "Unread"}</span>
              </div>

              <p className="message-email">
                <strong>Email:</strong> {msg.email || "No email provided"}
              </p>
              <p className="message-service">
                <strong>Service:</strong> {msg.serviceTitle}
              </p>
              <p className="message-content">{msg.message}</p>

              <div className="message-footer">
                <small>
                  {msg.createdAt?.seconds
                    ? new Date(msg.createdAt.seconds * 1000).toLocaleString()
                    : "No date"}
                </small>

                <div className="message-actions">
                    {/* Always can respond if email exists */}
                    {msg.email && (
                        <button
                        className="btn-respond"
                        onClick={() => respondToEmail(msg.email)}
                        >
                        Respond
                        </button>
                    )}

                    {/* If unread → show Mark as Read + Archive */}
                    {msg.status === "Unread" && (
                        <>
                        <button
                            className="btn-mark-read"
                            onClick={() => markAsRead(msg.id)}
                        >
                            Mark as Read
                        </button>
                        <button
                            className="btn-archive"
                            onClick={() => archiveMessage(msg.id)}
                        >
                            Archive
                        </button>
                        </>
                    )}

                    {/* If read → show Mark as Resolved + Archive */}
                    {msg.status === "Read" && (
                        <>
                        <button
                            className="btn-resolve"
                            onClick={() => markAsResolved(msg.id)}
                        >
                            Mark as Resolved
                        </button>
                        <button
                            className="btn-archive"
                            onClick={() => archiveMessage(msg.id)}
                        >
                            Archive
                        </button>
                        </>
                    )}

                    {/* If resolved → can only archive */}
                    {msg.status === "Resolved" && (
                        <button
                        className="btn-archive"
                        onClick={() => archiveMessage(msg.id)}
                        >
                        Archive
                        </button>
                    )}

                    {/* If archived → no actions */}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default ServicesMessages;
