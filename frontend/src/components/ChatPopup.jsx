import React, { useState, useRef } from 'react';

const ChatPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn?' }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    const toggleChat = () => {
        setIsVisible(!isVisible);
    };

    const sendMessage = () => {
        if (inputText.trim() === '') return;

        // Add user message
        const newMessages = [...messages, { type: 'user', text: inputText }];
        setMessages(newMessages);
        setInputText('');

        // Simulate bot response
        setTimeout(() => {
            setMessages([...newMessages, {
                type: 'bot',
                text: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!'
            }]);
            // Scroll to bottom
            scrollToBottom();
        }, 1000);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* Fixed Chat Button */}
            <button
                onClick={toggleChat}
                className="btn btn-secondary position-fixed bottom-0 end-0 m-4 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '56px', height: '56px' }}
            >
                <i className="fa fa-comment-dots fs-3"></i>
            </button>

            {/* Chat Popup */}
            {isVisible && (
                <div className="position-fixed bottom-0 end-0 m-4 w-80 bg-white rounded shadow">
                    <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                        <h3 className="fw-medium">Hỗ trợ trực tuyến</h3>
                        <button
                            onClick={toggleChat}
                            className="text-secondary"
                        >
                            <i className="fa fa-times"></i>
                        </button>
                    </div>
                    <div className="p-4" style={{ height: '320px', overflowY: 'auto' }}>
                        {messages.map((message, index) => (
                            <div key={index} className={`d-flex ${message.type === 'user' ? 'justify-content-end' : ''} mb-4`}>
                                <div className={`rounded p-3 ${
                                    message.type === 'user'
                                        ? 'bg-primary text-white'
                                        : 'bg-light text-dark'
                                }`} style={{ maxWidth: '80%' }}>
                                    <p>{message.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-top">
                        <div className="d-flex">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Nhập tin nhắn..."
                                className="form-control rounded-start border-0 bg-light text-dark"
                            />
                            <button
                                onClick={sendMessage}
                                className="btn btn-primary rounded-end"
                            >
                                <i className="fa fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatPopup;