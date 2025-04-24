import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Import CSS file
import { FaSearch, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/LogoWeb-removebg.png';
import avt from '../../assets/avt1.jpg';
import Profile from './Profile';
import ChangePassword from './ChangePassword';

const Header = () => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const navigate = useNavigate();
    const handleLogoutClick = () => {
        // Thực hiện các thao tác đăng xuất nếu cần
        navigate('/home');
      };

    const handleProfileClick = () => {
        setIsProfileModalOpen(true);
    };

    const closeModal = () => {
        setIsProfileModalOpen(false);
    };
    const handleChangePasswordClick = () => {
        setIsChangePasswordOpen(true);
    }
    const closeChangePassword = () => {
        setIsChangePasswordOpen(false);
    }
    const employeeData = {
        avatar: avt,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "0123456789",
        address: "HCM"
    };

    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className="search-box">
                <input type="text" placeholder="Tìm kiếm..." />
                <FaSearch className="search-icon" />
            </div>
            <div className="avatar-dropdown">
                <img 
                    src={avt}
                    alt="Avatar" 
                    className="avatar" 
                    onClick={() => toggleDropdown()} // Toggle dropdown
                />
                <div className="dropdown-content-header">
                <button onClick={handleProfileClick} className="link-button">
                    <FaUser />Thông tin cá nhân
                </button>
                <button onClick={handleChangePasswordClick} className="link-button">
                    <FaCog />Đổi mật khẩu
                </button>
                <button onClick={handleLogoutClick} className="link-button">
                    <FaSignOutAlt />Đăng xuất
                </button>
                </div>
            </div>
            {isProfileModalOpen && (
                <Profile
                    isOpen={isProfileModalOpen} 
                    onClose={closeModal} 
                    employeeData={employeeData} 
                />
            )}
            {isChangePasswordOpen &&
                <ChangePassword
                    isOpen={isChangePasswordOpen}
                    onClose={closeChangePassword}
                />
            }
        </header>
    );
};

const toggleDropdown = () => {
  const dropdown = document.querySelector('.dropdown-content-header');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
};

export default Header;
