import { useState, useRef, useEffect } from "react";
import ChatBox from "../../../pages/user/ChatboxPage/chatboxPage";
import { FaCommentDots } from "react-icons/fa";
import "./ChatBox.scss";

const ChatboxButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatboxRef = useRef(null);

  // Toggle chatbox open/close
  const toggleChatbox = () => {
    setIsChatOpen(prevState => !prevState); // Toggle the state
  };

  // Close chatbox when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatboxRef.current && !chatboxRef.current.contains(event.target)) {
        setIsChatOpen(false); // Close the chatbox if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button className="chatbox-button" onClick={toggleChatbox}>
        <FaCommentDots />
      </button>
      {isChatOpen && (
        <div ref={chatboxRef}>
          <ChatBox
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)} // Close the chatbox when the close button is clicked
          />
        </div>
      )}
    </>
  );
};

export default ChatboxButton;
