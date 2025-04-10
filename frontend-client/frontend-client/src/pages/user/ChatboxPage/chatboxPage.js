import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import "../../../component/Action/ChatboxButton/ChatBox.scss";

const ChatBox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);

  const API_BASE_URL = "https://api.it-ebook.io.vn/api/chatbot";

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "Hello! I'm your book assistant. How can I help you today?",
          sender: "bot",
          type: "welcome",
        },
      ]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    const userMessage = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/ask`, { message: userMessage });
      const { answer, displayType } = response.data;

      if (displayType === "list") {
        setMessages((prev) => [
          ...prev,
          { text: formatList(answer), sender: "bot", type: "list" },
        ]);
      } else if (displayType === "bookSuggestion") {
        setMessages((prev) => [
          ...prev,
          { text: formatBookSuggestions(answer), sender: "bot", type: "bookSuggestion" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: answer || "Sorry, I couldn't process that.", sender: "bot" },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "An error occurred. Please try again later.", sender: "bot", type: "error" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatList = (text) => {
    return text
      .split("\n")
      .map((line) => `• ${line.trim()}`)
      .join("\n");
  };

  const formatBookSuggestions = (text) => {
    return text
      .split("\n")
      .map((line) => `📚 ${line.trim()}`)
      .join("\n");
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`chatbox ${isOpen ? "open" : ""}`}>
      <div className="chatbox-header">
        <span>AI Book Assistant</span>
        <FaTimes className="close-icon" onClick={onClose} />
      </div>
      <div className="chatbox-body">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="message bot loading">Typing...</div>}
        <div ref={messageEndRef} />
      </div>
      <div className="chatbox-footer">
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage} disabled={isLoading}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
