import { memo, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./buttonFollow.scss";

const BookFollowButton = ({ bookId, hasFollow = true }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followId, setFollowId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthData = useCallback(() => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      toast.warn("Please login to follow the book!", { autoClose: 1500 });
      return null;
    }

    return { email, token };
  }, []);

  const checkFollowStatus = useCallback(async () => {
    const authData = getAuthData();
    if (!authData) return;

    const { email, token } = authData;

    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/follow-books/user/${email}/book/${bookId}`,
        { headers: { Authorization: `Bearer ${token}` },
      validateStatus: (status) => status === 200 || status === 404, 
      }
      );

      if (response.data) {
        setIsFollowing(true);
        setFollowId(response.data.id);
      } else {
        setIsFollowing(false);
        setFollowId(null);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setIsFollowing(false);
        setFollowId(null);
      } else {
        const errorMsg =
          err.response?.data?.message || "Unable to check status ❌";
        setError(errorMsg);
        toast.error(errorMsg, { autoClose: 1500 });
      }
    } finally {
      setIsLoading(false);
    }
  }, [bookId, getAuthData]);

  const handleFollow = async () => {
    const authData = getAuthData();
    if (!authData) return;

    const { email, token } = authData;

    try {
      setIsLoading(true);

      if (isFollowing) {
        await axios.delete(
          `https://api.it-ebook.io.vn/api/follow-books/user/${email}/book/${bookId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Unfollowed 📖", { autoClose: 1500 });
      } else {
        const response = await axios.post(
          "https://api.it-ebook.io.vn/api/follow-books",
          { email, bookId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowId(response.data.id);
        toast.success("Followed successfully 🌟", { autoClose: 1500 });
      }

      setIsFollowing(!isFollowing);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Follow failed ❌";
      setError(errorMsg);
      toast.error(errorMsg, { autoClose: 1500 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkFollowStatus();
  }, [bookId, checkFollowStatus]);

  return (
    <div className="book-follow-button">
      <ToastContainer position="top-right" autoClose={1500} />
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {hasFollow && (
        <button
          type="button"
          className={`btn ${isFollowing ? "btn-unfollow" : "btn-follow"}`}
          onClick={handleFollow}
          disabled={isLoading}
          aria-label={isFollowing ? "Unfollow" : "Follow"}
        >
          {isLoading ? "..." : isFollowing ? "✓ Following" : "⭐ Follow"}
        </button>
      )}
    </div>
  );
};

export default memo(BookFollowButton);
