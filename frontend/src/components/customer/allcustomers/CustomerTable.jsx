import React, {} from 'react';
import { ImProfile } from 'react-icons/im';
import './CustomerTable.css';
import { useNavigate } from 'react-router-dom';
const CustomerTable = ({customers}) => {
    const navigate = useNavigate();
    const handlProfileCustomer = (customer) => {
        navigate(`infoCustomer/${customer.id}`, { state: { customer } });
    }
    return (
        <div>
            <table className="customer-table">
                <thead>
                    <tr>
                        <th>TÊN KHÁCH HÀNG</th>
                        <th>SỐ ĐIỆN THOẠI</th>
                        <th>EMAIL</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.name}</td>
                            <td>{customer.phone_number}</td>
                            <td>{customer.email}</td>
                            <td>
                                <ImProfile className='icon' onClick={() => handlProfileCustomer(customer)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerTable;