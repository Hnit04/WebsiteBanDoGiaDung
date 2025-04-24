import React, { useEffect } from 'react';
import "./Notification.css";

const Notification = ({ message, type, duration, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={'notification ${type}'}>
            {message} 
        </div>
    );
};

export default Notification;


