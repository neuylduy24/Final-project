import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "component/ProfileUser/SideBar/sideBar";
import "./userComments.scss";
import comment from "component/Comment/comment";

const UserComments = () => {
  const [comments, setComments] = useState([]);
  const {id: bookId} = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");

    if (!token || !userEmail) {
      toast.error("You must login to view your comments.!");
      return;
    }

    const fetchUserComments = async () => {
      try {
        const response = await axios.get(
          `https://api.it-ebook.io.vn/api/feedbacks/comments/${bookId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200 && Array.isArray(response.data)) {
          setComments(response.data);
        } else {
          setError("Unable to load comments.");
        }
      } catch (error) {
        setError("Error loading comments: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserComments();
  }, []);

  if (error) return <p>{error}</p>;
  if (!comments) return <p>You have no comments yet..</p>;

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
      <ToastContainer position="top-right" autoClose={1500} />
        <h2>Comment </h2>
        <div className="comment-list">
        {loading && <p>Loading list comments...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && comments.length === 0 && (
          <p>Not yet comments</p>
        )}
          {!comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <p><strong>Truyện:</strong> {comment.title}</p>
              <p><strong>Nội dung:</strong> {comment.content}</p>
              <p><small>{new Date(comment.createdAt).toLocaleString()}</small></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserComments;
