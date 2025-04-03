import { memo, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./comment.scss";

const Comment = ({ bookId, token, onCommentAdded }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.warn("Please enter a comment.");
      return;
    }
    if (!token) {
      toast.error("Please login to comment!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://api.it-ebook.io.vn/api/feedbacks",
        { bookId, content: comment, type: "COMMENT" }, // ❌ Không gửi userId
        { headers: { Authorization: `Bearer ${token}` } } // ✅ Gửi token
      );

      setComment(""); // Xóa nội dung input sau khi gửi thành công
      toast.success("Comment submitted successfully!");

      // Cập nhật danh sách comment
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to submit comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-container">
      <ToastContainer position="top-right" autoClose={1500} />
      <h3>Comment</h3>
      <input
        placeholder="Enter your comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={loading}
      />
      <button
        className="btn btn-comment"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default memo(Comment);
