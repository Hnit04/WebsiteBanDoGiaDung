// src/pages/admin/AdminDashboard.jsx
import React, { useState} from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import Header from '../../../components/header/Header';
import VoucherHeader from '../../../components/vouchers/allvouchers/VouchersHeader';
import VoucherHeader1 from '../../../components/vouchers/allvouchers/VoucherHeader1';
import VoucherTable from '../../../components/vouchers/allvouchers/VoucherTable';
import PaginationVoucher from '../../../components/vouchers/allvouchers/PaginationVouchers';
const AllVouchers = () => {
    const [vouchers] = useState([
        {id: '1', name: 'Khuyến mãi A', barcode: 50, type_voucher: '500,000₫', value_voucher: 20, status_voucher: 'Chưa hết hạn', used_vouchers: '1' },
            {id: '2', name: 'Khuyến mãi B', barcode: 30, type_voucher: '300,000₫', value_voucher: 10, status_voucher: 'Chưa hết hạn', used_vouchers: '1' },
            {id: '3', name: 'Khuyến mãi C', barcode: 20, type_voucher: '700,000₫', value_voucher: 5, status_voucher: 'Chưa hết hạn', used_vouchers: '1' },
            {id: '4', name: 'Khuyến mãi D', barcode: 15, type_voucher: '450,000₫', value_voucher: 7, status_voucher: 'Chưa hết hạn', used_vouchers: '1' },
            {id: '5', name: 'Khuyến mãi E', barcode: 25, type_voucher: '600,000₫', value_voucher: 15, status_voucher: 'Chưa hết hạn', used_vouchers: '1' },
            {id: '6', name: 'Khuyến mãi F', barcode: 10, type_voucher: '800,000₫', value_voucher: 3, status: 'Chưa hết hạn', used_vouchers: '1' },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items) => {
        setItemsPerPage(items);
        setCurrentPage(1); // Reset về trang đầu khi thay đổi số sản phẩm trên trang
    };

    // Tính toán các sản phẩm được hiển thị trên trang hiện tại
    const indexOfLastVoucher = currentPage * itemsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - itemsPerPage;
    const currentVouchers = vouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f2f5' }}>
            <Header /> {/* Header chiếm chiều rộng đầy đủ */}
            <div style={{ background: '#f0f2f5' }}>
                <div style={{ display: 'flex', flex: 1, paddingTop: '85px' }}>
                    <Sidebar />
                    <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
                        <VoucherHeader />
                        <VoucherHeader1 voucherCount={vouchers.length} />
                        <VoucherTable vouchers={currentVouchers} /> {/* Chỉ hiển thị sản phẩm của trang hiện tại */}
                        <PaginationVoucher 
                            totalItems={vouchers.length} // Tổng số sản phẩm
                            itemsPerPage={itemsPerPage} 
                            onPageChange={handlePageChange} // Hàm thay đổi trang
                            onItemsPerPageChange={handleItemsPerPageChange}  // Hàm thay đổi số lượng sản phẩm hiển thị
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllVouchers;
