import React, { useState } from 'react';
import './Profile.css'; // Đảm bảo rằng bạn đã áp dụng đúng CSS cho các thành phần

const ChangePassword = ({onClose}) => {
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Mật khẩu mới và mật khẩu xác nhận không khớp!");
            return;
        }
        console.log('Mật khẩu đã được thay đổi:', passwordData);
    };

    return (
        <div className="profile-overlay">
            <div className="profile">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>Thay đổi mật khẩu</h2>

                <div className="field-group">
                    <label>Mật khẩu cũ:</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handleChange}
                        className="editable-input"
                    />
                </div>

                <div className="field-group">
                    <label>Mật khẩu mới:</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                        className="editable-input"
                    />
                </div>

                <div className="field-group">
                    <label>Xác nhận mật khẩu mới:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handleChange}
                        className="editable-input"
                    />
                </div>

                <button onClick={handleSave} className="save-button">
                    Lưu
                </button>
            </div>
        </div>
    );
};

export default ChangePassword;
