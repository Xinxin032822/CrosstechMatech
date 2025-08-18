import React, { useState } from 'react'
import '../Styles/AdminDashboard.css'
import AdminPanel from '../Component/AdminPanel/AdminPanel'
import ProductManagement from '../Component/AdminPanelComponent/ProductManagement/ProductManagement';
import CurrentProducts from '../Component/AdminPanelComponent/CurrentProducts/CurrentProducts';
import InquiryManagement from '../Component/AdminPanelComponent/InquiryManagement/InquiryManagement';
import DeliveryManagement from '../Component/AdminPanelComponent/DeliveryManagement/DeliveryManagement';
import OrderHistory from '../Component/AdminPanelComponent/OrderHistory/OrderHistory';
import InventoryTracker from '../Component/AdminPanelComponent/InventoryTracker/InventoryTracker';
import ServicesManagement from '../Component/AdminPanelComponent/ServicesManagement/ServicesManagement';
import ServicesMessages from '../Component/AdminPanelComponent/ServicesMessages/ServicesMessages';
import CurrentServices from '../Component/AdminPanelComponent/CurrentServices/CurrentServices';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('product');

  return (
    <div className="admin-dashboard-grid">
      <div className="admin-dashboard-nav">
        <AdminPanel activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>
      <div className="admin-dashboard-main">
        {activeSection === 'product' && <div><ProductManagement/></div>}
        {activeSection === 'currentProducts' && <div><CurrentProducts setActiveSection={setActiveSection}/></div>}
        {activeSection === 'inquiry' && <div><InquiryManagement/></div>}
        {activeSection === 'delivery' && <div><DeliveryManagement/></div>}
        {activeSection === 'order' && <div><OrderHistory/></div>}
        {activeSection === 'inventory' && <div><InventoryTracker/></div>}
        {activeSection === 'services' && <div><ServicesManagement/></div>}
        {activeSection === 'serviceMessages' && <div><ServicesMessages/></div>}
        {activeSection === 'currentServices' && <div><CurrentServices/></div>}
      </div>
    </div>
  )
}

export default AdminDashboard