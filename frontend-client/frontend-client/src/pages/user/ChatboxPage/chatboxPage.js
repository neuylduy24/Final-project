import { useState, useEffect, useRef } from "react";
import "../../../component/Action/ChatboxButton/ChatBox.scss";
import { FaTimes, FaPaperPlane } from "react-icons/fa";

const ChatBox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatboxRef = useRef(null); // ref for chatbox
  const messageEndRef = useRef(null); // ref for scrolling to the bottom

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");

    // Simulating bot response (can be replaced with actual API)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Hello! How can I help?", sender: "bot" },
      ]);
    }, 1000);
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
        <span>Chat Support</span>
        <FaTimes className="close-icon" onClick={onClose} />
      </div>
      <div className="chatbox-body">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messageEndRef} /> {/* Invisible element for scrolling */}
      </div>
      <div className="chatbox-footer">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
