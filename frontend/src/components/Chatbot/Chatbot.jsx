import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, ChevronDown } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your Interns.pk Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const responses = {
        "what is this": "This platform is an internship management system connecting students and companies. It helps students find opportunities and companies find talent.",
        "who can register": "Students can register to apply for internships, and companies can register to post opportunities. Admin manages the verification process.",
        "how to apply": "To apply, simply go to the 'Browse Internships' section in your dashboard, find a role you like, and click the 'Apply Now' button.",
        "company post": "Companies can post internships from their dashboard under the 'Post Internship' section once they are verified by the admin.",
        "admin role": "Admin verifies company registrations, manages user accounts (activating/blocking), and monitors internship postings.",
        "platform": "This platform is an internship management system connecting students and companies.",
        "register": "Students and companies can register. Admin manages the system.",
        "apply": "Students can browse internships and click Apply Now.",
        "post": "Companies can post internships from their dashboard.",
        "admin": "Admin verifies companies and manages users."
    };

    const quickButtons = [
        "What is this platform?",
        "Who can register?",
        "How to apply?",
        "How to post internships?",
        "Admin role?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (text) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate Bot thinking
        setTimeout(() => {
            const botResponse = getBotResponse(text);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
        }, 600);
    };

    const getBotResponse = (msg) => {
        const lowerMsg = msg.toLowerCase();
        
        if (lowerMsg.includes("what is this") || lowerMsg.includes("platform")) return responses["what is this"];
        if (lowerMsg.includes("register") || lowerMsg.includes("account")) return responses["who can register"];
        if (lowerMsg.includes("apply")) return responses["how to apply"];
        if (lowerMsg.includes("post") || lowerMsg.includes("create")) return responses["company post"];
        if (lowerMsg.includes("admin")) return responses["admin role"];

        return "Sorry, I didn’t understand. Try asking about internships, registration, or companies. You can also use the quick buttons below!";
    };

    return (
        <div className="chatbot-wrapper">
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={28} />
                    <span className="btn-tooltip">Need Help?</span>
                </button>
            )}

            {/* Chat Box */}
            {isOpen && (
                <div className="chat-box-container">
                    <div className="chat-header">
                        <div className="bot-info">
                            <div className="bot-avatar">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3>Interns.pk Assistant</h3>
                                <span className="status-online">Online</span>
                            </div>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}>
                                <div className="message-bubble">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-footer">
                        <div className="quick-replies">
                            {quickButtons.map((btn, idx) => (
                                <button key={idx} onClick={() => handleSend(btn)} className="quick-btn">
                                    {btn}
                                </button>
                            ))}
                        </div>
                        <form className="chat-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(input); }}>
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" className="send-btn">
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
