import React, { useState} from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import Header from '../../../components/header/Header';
import OrdersHeader from '../../../components/order/OrdersHeader';
import OrdersHeader1 from '../../../components/order/OrdersHeader1';
import OrdersTable from '../../../components/order/OrdersTable';
import PaginationOrders from '../../../components/order/PaginationOrders';
const Orders = () => {
    const [orders] = useState([
        {
            id: '1',
            barcode: 'ORD123456',
            status: 'Chờ xác nhận',
            isDiscount: '5%',
            start_order_time: '2024-11-01 10:00 AM',
            total_orders: '500,000 VNĐ',
            products: [
                { name: 'Áo thun', quantity: 2, price: '100,000 VNĐ', total: '200,000 VNĐ' },
                { name: 'Quần jean', quantity: 1, price: '300,000 VNĐ', total: '300,000 VNĐ' }
            ]
        },
        {
            id: '2',
            barcode: 'ORD123457',
            status: 'Xác nhận',
            isDiscount: '10%',
            start_order_time: '2024-11-02 11:30 AM',
            total_orders: '450,000 VNĐ',
            products: [
                { name: 'Áo sơ mi', quantity: 3, price: '150,000 VNĐ', total: '450,000 VNĐ' }
            ]
        },
        {
            id: '3',
            barcode: 'ORD123458',
            status: 'Chờ xác nhận',
            isDiscount: '0%',
            start_order_time: '2024-11-03 09:45 AM',
            total_orders: '300,000 VNĐ',
            products: [
                { name: 'Giày thể thao', quantity: 1, price: '300,000 VNĐ', total: '300,000 VNĐ' }
            ]
        },
        {
            id: '4',
            barcode: 'ORD123459',
            status: 'Chờ xác nhận',
            isDiscount: '15%',
            start_order_time: '2024-11-04 08:00 AM',
            total_orders: '850,000 VNĐ',
            products: [
                { name: 'Áo khoác', quantity: 2, price: '250,000 VNĐ', total: '500,000 VNĐ' },
                { name: 'Quần short', quantity: 1, price: '350,000 VNĐ', total: '350,000 VNĐ' }
            ]
        },
        {
            id: '5',
            barcode: 'ORD123460',
            status: 'Xác nhận',
            isDiscount: '20%',
            start_order_time: '2024-11-05 02:15 PM',
            total_orders: '400,000 VNĐ',
            products: [
                { name: 'Sản phẩm X', quantity: 2, price: '100,000 VNĐ', total: '200,000 VNĐ' },
                { name: 'Sản phẩm Y', quantity: 1, price: '200,000 VNĐ', total: '200,000 VNĐ' }
            ]
        },
        {
            id: '6',
            barcode: 'ORD123461',
            status: 'Chờ xác nhận',
            isDiscount: '0%',
            start_order_time: '2024-11-06 01:30 PM',
            total_orders: '600,000 VNĐ',
            products: [
                { name: 'Balo', quantity: 1, price: '600,000 VNĐ', total: '600,000 VNĐ' }
            ]
        }
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
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);  
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f2f5' }}>
            <Header /> {/* Header chiếm chiều rộng đầy đủ */}
            <div style={{ background: '#f0f2f5' }}>
                <div style={{ display: 'flex', flex: 1, paddingTop: '85px' }}>
                    <Sidebar />
                    <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
                        <OrdersHeader />
                        <OrdersHeader1 orderCount={orders.length}/>
                        <OrdersTable orders={currentOrders} />
                        
                        <PaginationOrders
                            totalItems={orders.length} // Tổng số sản phẩm
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

export default Orders;
