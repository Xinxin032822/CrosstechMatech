import React from 'react'
import "./DeliveryManagement.css"
function DeliveryManagement() {

    const inquiries = [
        {
            id: 1,
            productImage: 'https://via.placeholder.com/40', // Replace with actual image path
            productName: 'CAT 320D Excavator',
            category: 'Heavy Equipment',
            message: 'Need pricing and availability for construction ...',
            date: 'Dec 15, 2024',
            status: 'Pending',
        },
        {
            id: 2,
            productImage: 'https://via.placeholder.com/40',
            productName: 'Komatsu D65 Bulldozer',
            category: 'Heavy Equipment',
            message: 'Interested in rental options for 6-month proje...',
            date: 'Dec 10, 2024',
            status: 'In Process',
        },
        {
            id: 3,
            productImage: 'https://via.placeholder.com/40',
            productName: 'Volvo L120 Wheel Loader',
            category: 'Heavy Equipment',
            message: 'Request for technical specifications and deliv...',
            date: 'Dec 5, 2024',
            status: 'Delivered',
        },
        {
            id: 4,
            productImage: 'https://via.placeholder.com/40',
            productName: 'Liebherr Mobile Crane',
            category: 'Heavy Equipment',
            message: 'Inquiry about crane capacity and operational ...',
            date: 'Nov 28, 2024',
            status: 'In Process',
        },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
            return 'badge orange';
            case 'In Process':
            return 'badge yellow';
            case 'Delivered':
            return 'badge green';
            default:
            return 'badge';
        }
    };
  return (
    <div className='Main-Delivery-Management-div-class'>
        {/* statuses */}
        <div className='Status-Delivery-Management-div-class'>

            {/* Total Inquiries */}
            <div className='StatusIconsDiv Total-Inquiries-Div'>
            <div>
                <p className="status-title">Total Inquiries</p>
                <p className="status-count">12</p>
            </div>
            <div className="icon-container blue"><i className="fas fa-envelope"></i></div>
            </div>

            {/* Pending */}
            <div className='StatusIconsDiv Pending-Div'>
            <div>
                <p className="status-title">Pending</p>
                <p className="status-count">3</p>
            </div>
            <div className="icon-container orange"><i className="fas fa-clock"></i></div>
            </div>

            {/* In Process */}
            <div className='StatusIconsDiv In-Process-Div'>
            <div>
                <p className="status-title">In Process</p>
                <p className="status-count">7</p>
            </div>
            <div className="icon-container yellow"><i className="fas fa-cog"></i></div>
            </div>

            {/* Delivered */}
            <div className='StatusIconsDiv Delivered-Div'>
            <div>
                <p className="status-title">Delivered</p>
                <p className="status-count">2</p>
            </div>
            <div className="icon-container green"><i className="fas fa-check"></i></div>
            </div>

        </div>
        {/* table */}
        <div className="table-container">
            <table className="inquiry-table">
            <thead>
                <tr>
                <th>PRODUCT</th>
                <th>INQUIRY MESSAGE</th>
                <th>DATE SUBMITTED</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {inquiries.map((inq) => (
                <tr key={inq.id}>
                    <td>
                    <div className="product-info">
                        <img src={inq.productImage} alt={inq.productName} />
                        <div>
                        <p className="product-name">{inq.productName}</p>
                        <p className="product-category">{inq.category}</p>
                        </div>
                    </div>
                    </td>
                    <td>{inq.message}</td>
                    <td>{inq.date}</td>
                    <td>
                    <span className={getStatusClass(inq.status)}>
                        {inq.status === 'Pending' && <i className="fas fa-clock"></i>}
                        {inq.status === 'In Process' && <i className="fas fa-cog"></i>}
                        {inq.status === 'Delivered' && <i className="fas fa-check"></i>}
                        <span className="status-label">{inq.status}</span>
                    </span>
                    </td>
                    <td><span className="view-details">View Details</span></td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        {/* nav */}
        <div>
            <div></div>
            <div></div>
        </div>

    </div>
  )
}

export default DeliveryManagement