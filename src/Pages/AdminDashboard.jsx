import React, { useState } from 'react'
import '../Styles/AdminDashboard.css'
import AdminPanel from '../Component/AdminPanel/AdminPanel'
import ProductManagement from '../Component/AdminPanelComponent/ProductManagement/ProductManagement';
import CurrentProducts from '../Component/AdminPanelComponent/CurrentProducts/CurrentProducts';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('product');

  return (
    <div className="admin-dashboard-grid">
      <div className="admin-dashboard-nav">
        <AdminPanel activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>
      <div className="admin-dashboard-main">
        {activeSection === 'product' && <div><ProductManagement/></div>}
        {activeSection === 'currentProducts' && <div><CurrentProducts/></div>}
        {activeSection === 'inquiry' && <div>Inquiry Management Section</div>}
        {activeSection === 'delivery' && <div>Delivery Management Section</div>}
        {activeSection === 'order' && <div>Order History Section</div>}
        {activeSection === 'inventory' && <div>Inventory Tracker Section</div>}
        {activeSection === 'services' && <div>Services Management Section</div>}
        {activeSection === 'serviceMessages' && <div>Services Messages Section</div>}
      </div>
    </div>
  )
}

export default AdminDashboard