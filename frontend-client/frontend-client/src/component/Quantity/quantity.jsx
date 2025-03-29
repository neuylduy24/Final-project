import { memo, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './quantity.scss';

const BookFollowButton = ({ bookId, hasFollow = true }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [followId, setFollowId] = useState(null); // Thêm state để lưu ID follow
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAuthData = useCallback(() => {
        try {
            const email = localStorage.getItem("email");
            const token = localStorage.getItem("token");
            
            if (!email || !token) {
                throw new Error("Vui lòng đăng nhập");
            }
            
            return { email, token };
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
            return { email: null, token: null };
        }
    }, []);

    // Kiểm tra trạng thái follow
    const checkFollowStatus = useCallback(async () => {
        const { email, token } = getAuthData();
        if (!email || !token) return;

        try {
            setIsLoading(true);
            const response = await axios.get(
                `https://api.it-ebook.io.vn/api/follow-books/user/${email}/book/${bookId}`,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data) {
                setIsFollowing(true);
                setFollowId(response.data.id); // Lưu ID follow nếu tồn tại
            } else {
                setIsFollowing(false);
                setFollowId(null);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setIsFollowing(false);
                setFollowId(null);
            } else {
                const errorMsg = err.response?.data?.message || 
                               "Không thể kiểm tra trạng thái";
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } finally {
            setIsLoading(false);
        }
    }, [bookId, getAuthData]);

    // Xử lý theo dõi
    const handleFollow = async () => {
        const { email, token } = getAuthData();
        if (!email || !token) return;

        try {
            setIsLoading(true);
            
            if (isFollowing) {
                // Sử dụng endpoint mới với email và bookId
                await axios.delete(
                    `https://api.it-ebook.io.vn/api/follow-books/user/${email}/book/${bookId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                const response = await axios.post(
                    'https://api.it-ebook.io.vn/api/follow-books',
                    { email, bookId }, // Gửi theo cấu trúc API
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFollowId(response.data.id); // Lưu ID follow mới
            }
            
            setIsFollowing(!isFollowing);
            setError(null);
            toast.success(isFollowing ? "Đã bỏ theo dõi" : "Đã theo dõi thành công");
        } catch (err) {
            const errorMsg = err.response?.data?.message || 
                           err.message || 
                           "Thao tác thất bại";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkFollowStatus();
    }, [bookId, checkFollowStatus]);

    return (
        <div className="book-follow-button">
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}
            
            {hasFollow && (
                <button 
                    type="button" 
                    className={`btn ${isFollowing ? 'btn-unfollow' : 'btn-follow'}`}
                    onClick={handleFollow}
                    disabled={isLoading}
                    aria-label={isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
                >
                    {isLoading ? '...' : (isFollowing ? '✓ Đang theo dõi' : '⭐ Theo dõi')}
                </button>
            )}
        </div>
    );
};

export default memo(BookFollowButton);