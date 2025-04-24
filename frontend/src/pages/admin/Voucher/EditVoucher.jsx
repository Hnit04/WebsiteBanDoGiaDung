// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import Header from '../../../components/header/Header';
import EditVoucherHeader from '../../../components/vouchers/editvoucher/EditVoucherHeader';
import EditVoucherTable from '../../../components/vouchers/editvoucher/EditVoucherTable';
import { useParams } from 'react-router-dom';
const EditVoucher = () => {
    const { id } = useParams();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f2f5' }}>
            <Header /> {/* Header chiếm chiều rộng đầy đủ */}
            <div style={{ background: '#f0f2f5' }}>
                <div style={{ display: 'flex', flex: 1, paddingTop: '85px' }}>
                    <Sidebar />
                    <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
                        <EditVoucherHeader />
                        <EditVoucherTable voucherId={id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditVoucher;
