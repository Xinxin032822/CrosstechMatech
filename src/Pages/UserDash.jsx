import React, { useState } from "react";
import "../Styles/UserDash.css";
import Orders from "../Component/UserDash/Orders";
import Deliveries from "../Component/UserDash/Deliveries";
import SavedAddresses from "../Component/UserDash/SavedAddresses";
import Cart from "../Component/UserDash/Cart";

export default function UserDash() {
    const [activeSection, setActiveSection] = useState("Orders");
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
    };


    const renderContent = () => {
        switch (activeSection) {
        case "Orders":
            return (
            <div>
                <Orders/>
            </div>
            );
        case "Deliveries":
            return (
            <div>
                <Deliveries/>
            </div>
            );
        case "Saved Addresses":
            return (
            <div>
                <SavedAddresses/>
            </div>
            );
        case "Cart":
            return (
            <div>
                <Cart />
            </div>
            );
        default:
            return (
            <div>
                <h2>Welcome, {user.name}</h2>
                <p>Select an option from the sidebar.</p>
            </div>
            );
        }
    };
  return (
    <div className="userdash-container">
        <aside className="userdash-sidebar">
            <div className="userdash-info">
                <h2 className="userdash-name">{user.name}</h2>
                <p className="userdash-email">{user.email}</p>
            </div>

            <nav className="userdash-nav">
            {["Orders", "Deliveries", "Saved Addresses", "Cart"].map((section) => (
                <button
                key={section}
                className={`userdash-nav-btn ${
                    activeSection === section ? "active" : ""
                }`}
                onClick={() => setActiveSection(section)}
                >
                {section}
                </button>
            ))}
            </nav>

            <div className="userdash-logout">
                <button className="userdash-logout-btn">Logout</button>
            </div>
        </aside>

        <main className="userdash-main">{renderContent()}</main>
    </div>
  );
}
