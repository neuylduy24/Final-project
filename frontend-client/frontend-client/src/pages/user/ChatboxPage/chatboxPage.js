import { useState, useEffect, useRef } from "react";
import "../../../component/Action/ChatboxButton/ChatBox.scss";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import axios from "axios";

const ChatBox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatboxRef = useRef(null); // ref for chatbox
  const messageEndRef = useRef(null); // ref for scrolling to the bottom

  // Add initial welcome message when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { 
          text: "Hello! I'm your book assistant. How can I help you today?", 
          sender: "bot" 
        }
      ]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message to chat
    setMessages([...messages, { text: input, sender: "user" }]);
    const userMessage = input;
    setInput("");
    setIsLoading(true);

    try {
      // Call OpenAI chatbot API through your backend
      const response = await axios.post("https://api.it-ebook.io.vn/api/chatbot/ask", {
        message: userMessage
      });
      
      setMessages(prev => [
        ...prev,
        { text: response.data, sender: "bot" }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev,
        { 
          text: "Sorry, I need to take a break. Please try again later.", 
          sender: "bot" 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to the bottom when a new message is added
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleMouseDownOutside = (event) => {
      if (chatboxRef.current && !chatboxRef.current.contains(event.target)) {
        onClose(); // Close chatbox if click is outside
      }
    };

    document.addEventListener("mousedown", handleMouseDownOutside);
    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutside);
    };
  }, [onClose]);

  return (
    <div className={`chatbox ${isOpen ? "open" : ""}`} ref={chatboxRef}>
      <div className="chatbox-header">
        <span>AI Book Assistant</span>
        <div className="chatbox-controls">
          <FaTimes className="close-icon" onClick={onClose} />
        </div>
      </div>
      <div className="chatbox-body">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot loading">
            <span className="loading-dots">...</span>
          </div>
        )}
        <div ref={messageEndRef} /> {/* Invisible element for scrolling */}
      </div>
      <div className="chatbox-footer">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
