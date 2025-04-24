import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/header/Header';

const Customers = () => {
    return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header /> {/* Header chiếm chiều rộng đầy đủ */}
        <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <div style={{ marginLeft: '300px', padding: '20px', width: '100%' }}>
                <h1>Welcome to the Customers</h1>
                <p>This is customers page.</p>
            </div>
        </div>
    </div>
    );
};

export default Customers;
