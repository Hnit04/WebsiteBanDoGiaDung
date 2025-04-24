// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/header/Header';
import TotalOrders from '../../components/dashboard/TotalOrders';
import RevenueToday from '../../components/dashboard/RevenueToday';
import OrderRevenue from '../../components/dashboard/OrderRevenue';
import PendingOrders from '../../components/dashboard/PendingOrders';
import SuccessfulOrders from '../../components/dashboard/SuccessfulOrders';
import CustomerCount from '../../components/dashboard/CustomerCount';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import PendingOrdersCard from '../../components/dashboard/PendingOrdersCard';
import PendingPaymentOrdersCard from '../../components/dashboard/PendingPaymentOrdersCard';
import './Dashboard.css';

const Dashboard = () => {
    const totalOrders = 120;
    const revenueToday = 1500;
    const orderRevenue = 50000;
    const pendingOrders = 15;
    const successfulOrders = 100;
    const customerCount = 200;
    const pendingOrdersList = [
        { id: 'DH001', status: 'Chờ xác nhận', date: '2024-10-01' },
        { id: 'DH002', status: 'Chờ xác nhận', date: '2024-10-02' },
        // Thêm các đơn hàng khác
    ];

    const pendingPaymentOrders = [
        { id: 'DH003', paymentStatus: 'Chưa thanh toán' },
        { id: 'DH004', paymentStatus: 'Chưa thanh toán' },
        // Thêm các đơn hàng khác
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header /> {/* Header chiếm chiều rộng đầy đủ */}
            <div className="dashboard-container">
                <div style={{ display: 'flex', flex: 1, paddingTop: '85px' }}>
                    <Sidebar />
                    <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
                        <DashboardHeader />
                        <div className="dashboard-grid">
                            <TotalOrders totalOrders={totalOrders} />
                            <RevenueToday revenue={revenueToday} />
                            <OrderRevenue orderRevenue={orderRevenue} />
                            <PendingOrders pendingOrders={pendingOrders} />
                            <SuccessfulOrders successfulOrders={successfulOrders} />
                            <CustomerCount customerCount={customerCount} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <PendingOrdersCard orders={pendingOrdersList} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <PendingPaymentOrdersCard orders={pendingPaymentOrders} />
                            </div>
                        </div>
                    </div>
                </div>                
            </div>

        </div>
    );
};

export default Dashboard;
