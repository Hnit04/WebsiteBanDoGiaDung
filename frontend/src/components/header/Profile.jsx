import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ onClose, employeeData }) => {
    const [profileData, setProfileData] = useState(employeeData);
    const [avatar, setAvatar] = useState(employeeData.avatar);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarClick = () => {
        document.getElementById('avatar-upload').click();
    };

    const handleSave = () => {
        console.log('Profile data saved:', profileData);
        console.log('Updated avatar:', avatar);
        onClose();
    };

    return (
        <div className="profile-overlay">
            <div className="profile">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <img
                    src={avatar}
                    alt="Avatar"
                    className="avatar-large"
                    onClick={handleAvatarClick}
                    style={{ cursor: 'pointer' }} 
                />

                <input 
                    type="file" 
                    id="avatar-upload" 
                    onChange={handleAvatarChange} 
                    className="avatar-input"
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                <div className="info-section">
                    <h2>Thông tin cá nhân</h2>

                    <div className="field-group">
                        <label>Tên:</label>
                        <input
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleChange}
                            className="editable-input"
                        />
                    </div>

                    <div className="field-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            className="editable-input"
                        />
                    </div>

                    <div className="field-group">
                        <label>Số điện thoại:</label>
                        <input
                            type="text"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleChange}
                            className="editable-input"
                        />
                    </div>

                    <div className="field-group">
                        <label>Địa chỉ:</label>
                        <input
                            type="text"
                            name="address"
                            value={profileData.address}
                            onChange={handleChange}
                            className="editable-input"
                        />
                    </div>

                    <button onClick={handleSave} className="save-button">
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
