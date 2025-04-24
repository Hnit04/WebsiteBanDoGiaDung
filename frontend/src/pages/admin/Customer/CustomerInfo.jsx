// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import Header from '../../../components/header/Header';
import CustomerInfoHeader from '../../../components/customer/customerInfo/CustomerInfoHeader';
import CustomerInfoForm from '../../../components/customer/customerInfo/CustomerInfoForm';
const CustomerInfo = () => {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f2f5' }}>
            <Header /> {/* Header chiếm chiều rộng đầy đủ */}
            <div style={{ background: '#f0f2f5' }}>
                <div style={{ display: 'flex', flex: 1, paddingTop: '85px' }}>
                    <Sidebar />
                    <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
                        <CustomerInfoHeader />
                        <CustomerInfoForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfo;
