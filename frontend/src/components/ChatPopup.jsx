import React, { useState, useRef } from "react";

const ChatPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [messages, setMessages] = useState([
        { type: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    const toggleChat = () => {
        setIsVisible(!isVisible);
    };

    const sendMessage = () => {
        if (inputText.trim() === "") return;

        const newMessages = [...messages, { type: "user", text: inputText }];
        setMessages(newMessages);
        setInputText("");

        setTimeout(() => {
            setMessages([
                ...newMessages,
                {
                    type: "bot",
                    text: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!",
                },
            ]);
            scrollToBottom();
        }, 1000);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            {/* Nút mở chat */}
            <button
                onClick={toggleChat}
                className="fixed bottom-4 right-4 w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg transition-transform transform scale-95 hover:scale-100"
            >
                <i className="fa fa-comment-dots text-2xl"></i>
            </button>

            {/* Hộp chat */}
            {isVisible && (
                <div className="fixed bottom-16 right-4 w-80 bg-white rounded-lg shadow-lg animate-fadeIn">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold">Hỗ trợ trực tuyến</h3>
                        <button onClick={toggleChat} className="text-gray-500">
                            <i className="fa fa-times"></i>
                        </button>
                    </div>

                    <div className="p-4 h-80 overflow-y-auto flex flex-col space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`max-w-[80%] p-3 rounded-lg ${
                                    message.type === "user"
                                        ? "bg-blue-500 text-white self-end"
                                        : "bg-gray-200 text-black self-start"
                                }`}
                            >
                                {message.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t flex">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 px-3 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-blue-500 text-white px-4 rounded-r-lg"
                        >
                            <i className="fa fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatPopup;
