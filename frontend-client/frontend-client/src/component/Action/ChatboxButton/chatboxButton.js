import { useState } from "react";
import ChatBox from "../../../pages/user/ChatboxPage/chatboxPage";
import { FaCommentDots } from "react-icons/fa";
import "./ChatBox.scss";

const ChatboxButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Hàm toggle trạng thái chatbox
  const toggleChatbox = () => {
    setIsChatOpen((prevState) => !prevState);
  };

  return (
    <>
      <button className="chatbox-button" onClick={toggleChatbox}>
        <FaCommentDots />
      </button>
      {isChatOpen && (
        <ChatBox
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)} // Đóng chatbox khi bấm nút "close"
        />
      )}
    </>
  );
};

export default ChatboxButton;
