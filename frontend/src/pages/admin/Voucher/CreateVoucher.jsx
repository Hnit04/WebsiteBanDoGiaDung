// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import Header from '../../../components/header/Header';
import CreateVoucherHeader from '../../../components/vouchers/createvoucher/CreateVoucherHeader';
import CreateVoucherInfo from '../../../components/vouchers/createvoucher/CreateVoucherInfo';
const CreateVoucher = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f2f5' }}>
            <Header /> {/* Header chiếm chiều rộng đầy đủ */}
            <div style={{ background: '#f0f2f5' }}>
                <div style={{ display: 'flex', flex: 1, paddingTop: '85px' }}>
                    <Sidebar />
                    <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
                        <CreateVoucherHeader />
                        <CreateVoucherInfo />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateVoucher;
