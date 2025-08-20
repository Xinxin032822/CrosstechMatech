import React, { useState } from 'react'
import './AdminPanel.css'
import { 
  FiBox, FiHelpCircle, FiTruck, FiClock, FiArchive, 
  FiTool, FiMail, FiList, FiChevronDown, FiChevronUp 
} from 'react-icons/fi'
import { FaAngleRight } from 'react-icons/fa'

function AdminPanel({ activeSection, setActiveSection }) {
  const [openMobile, setOpenMobile] = useState(false);

  const navItems = [
    { label: 'Product Management', key: 'product', icon: <FiBox /> },
    { label: 'Current Products', key: 'currentProducts', icon: <FiList /> },
    { label: 'Inquiry Management', key: 'inquiry', icon: <FiHelpCircle /> },
    { label: 'Delivery Management', key: 'delivery', icon: <FiTruck /> },
    { label: 'Order History', key: 'order', icon: <FiClock /> },
    { label: 'Inventory Tracker', key: 'inventory', icon: <FiArchive /> },
    { label: 'Services Management', key: 'services', icon: <FiTool /> },
    { label: 'Services Messages', key: 'serviceMessages', icon: <FiMail /> },
    { label: 'Current Services', key: 'currentServices', icon: <FiList /> },
  ];

  return (
    <div className='admin-panel'>
      <div 
        className="admin-brand" 
        onClick={() => setOpenMobile(!openMobile)}
      >
        <span>
          <span style={{color:"#e50914", fontWeight: 600}}>Matech</span> Admin
        </span>
        <span className="mobile-toggle">
          {openMobile ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      </div>

      <nav className={`admin-nav ${openMobile ? 'open' : ''}`}>
        {navItems.map(item => (
          <button
            key={item.key}
            className={`admin-nav-btn${activeSection === item.key ? ' active' : ''}`}
            onClick={() => {
              setActiveSection(item.key);
              setOpenMobile(false);
            }}
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {item.icon}
              {item.label}
            </span>
            <span
              style={{
                marginLeft: '12px',
                verticalAlign: 'middle',
                transition: 'transform 0.3s',
                transform: activeSection === item.key ? 'translateX(10px)' : 'none'
              }}
            >
              <FaAngleRight />
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default AdminPanel
