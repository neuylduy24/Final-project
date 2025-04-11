import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaTrash } from "react-icons/fa";
import axios from "axios";
import "../../../component/Action/ChatboxButton/ChatBox.scss";
import BookCard from "component/Book/Card/bookDetailCard";
import { useNavigate } from "react-router-dom";

const ChatBox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE_URL = "https://api.it-ebook.io.vn/api/chatbot";
  const STORAGE_KEY = "chatbox_history";

  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([
          {
            text: "Hello! I'm your book assistant. How can I help you today?",
            sender: "bot",
            type: "welcome",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      setMessages([
        {
          text: "Hello! I'm your book assistant. How can I help you today?",
          sender: "bot",
          type: "welcome",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    const userMessage = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/ask`, {
        message: userMessage,
      });
      const { answer, displayType } = response.data;

      if (displayType === "list") {
        setMessages((prev) => [
          ...prev,
          { text: formatList(answer), sender: "bot", type: "list" },
        ]);
      } else if (displayType === "bookSuggestion") {
        // For book suggestions, we need to fetch the full book data
        if (Array.isArray(answer)) {
          const bookPromises = answer.map(async (bookInfo) => {
            try {
              // Extract book ID from URL
              const urlParts = bookInfo.url.split("/");
              const bookId = urlParts[urlParts.length - 1];

              if (bookId) {
                const bookResponse = await axios.get(
                  `https://api.it-ebook.io.vn/api/books/${bookId}`
                );
                return {
                  ...bookResponse.data,
                  originalUrl: bookInfo.url, // Keep the original URL
                };
              }
              return bookInfo;
            } catch (error) {
              console.error("Error fetching book details:", error);
              return bookInfo;
            }
          });

          const bookDetails = await Promise.all(bookPromises);

          setMessages((prev) => [
            ...prev,
            { text: bookDetails, sender: "bot", type: "bookSuggestion" },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { text: answer, sender: "bot", type: "bookSuggestion" },
          ]);
        }
      } else {
        // Process regular text that may contain links
        const processedAnswer = await processMessageWithLinks(
          answer || "Sorry, I couldn't process that."
        );

        if (
          processedAnswer &&
          typeof processedAnswer === "object" &&
          processedAnswer.books
        ) {
          // If books are found, display text and books
          setMessages((prev) => [
            ...prev,
            {
              text: processedAnswer.originalText,
              books: processedAnswer.books,
              sender: "bot",
              type: "textWithBooks",
            },
          ]);
        } else {
          // If no books are found, display regular text
          setMessages((prev) => [
            ...prev,
            {
              text: processedAnswer || "Sorry, I couldn't process that.",
              sender: "bot",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "An error occurred. Please try again later.",
          sender: "bot",
          type: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    const welcomeMessage = {
      text: "Chat history cleared. How can I help you today?",
      sender: "bot",
      type: "welcome",
    };
    setMessages([welcomeMessage]);
  };

  const formatList = (text) => {
    return text
      .split("\n")
      .map((line) => `• ${line.trim()}`)
      .join("\n");
  };

  const processMessageWithLinks = async (text) => {
    if (!text || typeof text !== "string") return text;

    // Regex để tìm Markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;

    // Tìm tất cả các link trong văn bản
    while ((match = linkRegex.exec(text)) !== null) {
      const [fullMatch, title, url] = match;

      // Kiểm tra nếu URL có chứa "chi-tiet-truyen"
      if (url.includes("chi-tiet-truyen")) {
        // Lấy book ID từ URL
        const urlParts = url.split("/");
        const bookId = urlParts[urlParts.length - 1];

        if (bookId) {
          links.push({
            fullMatch,
            title,
            url,
            bookId,
            index: match.index,
          });
        }
      }
    }

    // Nếu không tìm thấy link nào, trả về text gốc
    if (links.length === 0) return text;

    // Lấy thông tin sách từ API
    const bookPromises = links.map(async (link) => {
      try {
        const response = await axios.get(
          `https://api.it-ebook.io.vn/api/books/${link.bookId}`
        );
        return {
          ...response.data,
          originalUrl: link.url,
          originalMatch: link.fullMatch,
        };
      } catch (error) {
        console.error(`Error fetching book details for ${link.bookId}:`, error);
        return null;
      }
    });

    const books = (await Promise.all(bookPromises)).filter(
      (book) => book !== null
    );

    // Nếu không lấy được thông tin sách nào, trả về text gốc
    if (books.length === 0) return text;

    // Trả về thông tin sách và text đã được xử lý
    return {
      originalText: text,
      books,
    };
  };

  // Thêm hàm này để chuẩn hóa URL trước khi điều hướng
  const normalizeBookUrl = (url) => {
    // Nếu là URL đầy đủ (http://... hoặc https://...)
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      // Trích xuất ID từ URL
      const urlParts = url.split("/");
      const bookId = urlParts[urlParts.length - 1];
      return `/user/chi-tiet-truyen/${bookId}`;
    }

    // Nếu là đường dẫn tương đối có /user/ ở đầu
    if (url && url.startsWith("/user/")) {
      return url;
    }

    // Nếu chỉ là ID
    if (url && !url.includes("/")) {
      return `/user/chi-tiet-truyen/${url}`;
    }

    // Trường hợp mặc định
    return url;
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`chatbox ${isOpen ? "open" : ""}`}>
      <div className="chatbox-header">
        <span>AI Book Assistant</span>
        <div className="header-controls">
          <FaTrash
            className="clear-icon"
            onClick={clearHistory}
            title="Clear chat history"
          />
          <FaTimes className="close-icon" onClick={onClose} />
        </div>
      </div>
      <div className="chatbox-body">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.type === "bookSuggestion" && Array.isArray(msg.text) ? (
              <div className="book-suggestion-list">
                {msg.text.map((book, idx) => (
                  <div
                    key={idx}
                    className="book-card-wrapper"
                    onClick={() => {
                      if (book.originalUrl) {
                        navigate(normalizeBookUrl(book.originalUrl));
                      } else if (book.url) {
                        navigate(normalizeBookUrl(book.url));
                      } else if (book._id) {
                        navigate(`/user/chi-tiet-truyen/${book._id}`);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            ) : msg.type === "textWithBooks" ? (
              <div>
                <div className="book-suggestion-list">
                  {msg.books.map((book, idx) => (
                    <div
                      key={idx}
                      className="book-card-wrapper"
                      onClick={() => {
                        if (book.originalUrl) {
                          navigate(normalizeBookUrl(book.originalUrl));
                        } else if (book.url) {
                          navigate(normalizeBookUrl(book.url));
                        } else if (book._id) {
                          navigate(`/user/chi-tiet-truyen/${book._id}`);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>{msg.text}</div>
            )}
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
