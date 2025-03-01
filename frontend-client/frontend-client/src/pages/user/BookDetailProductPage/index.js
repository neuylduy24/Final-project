import { memo, useState } from "react";
import "./style.scss";
import { FaThumbsUp, FaThumbsDown, FaReply, FaEye, FaFacebook, FaInstagram } from "react-icons/fa6";
import BreadCrumb from "../theme/breadCrumb";
import feat1Img from "assets/user/image/categories/sach1.webp";
import feat2Img from "assets/user/image/categories/sach2.webp";
import feat3Img from "assets/user/image/categories/sach3.webp";
import { ProductCard } from "component";
import { featProducts } from "utils/common";
import Quantity from "component/Quantity";

const chaptersData = [
  { id: 324, title: "Chapter 324: Trận Chiến Định Mệnh" },
  { id: 325, title: "Chapter 325: Kẻ Thù Mới" },
  { id: 326, title: "Chapter 326: Hành Trình Mới" },
  { id: 324, title: "Chapter 324: Trận Chiến Định Mệnh" },
  { id: 325, title: "Chapter 325: Kẻ Thù Mới" },
  { id: 326, title: "Chapter 326: Hành Trình Mới" },
  { id: 324, title: "Chapter 324: Trận Chiến Định Mệnh" },
  { id: 325, title: "Chapter 325: Kẻ Thù Mới" },
  { id: 326, title: "Chapter 326: Hành Trình Mới" },
  { id: 324, title: "Chapter 324: Trận Chiến Định Mệnh" },
  { id: 325, title: "Chapter 325: Kẻ Thù Mới" },
  { id: 326, title: "Chapter 326: Hành Trình Mới" },
];

const commentsData = [
  {
    id: 1,
    user: "ppew",
    avatar: "path_to_avatar_1",
    level: 6,
    chapter: 324,
    text: "đánh thả ga, hấp hối thì chờ bình hp đến =)",
    time: "4 Ngày Trước",
    likes: 0,
    dislikes: 0,
  },
  {
    id: 2,
    user: "anh",
    avatar: "path_to_avatar_2",
    level: 3,
    chapter: 325,
    text: "Lao vào đánh đúng là tứ chi phát triển",
    time: "4 Ngày Trước",
    likes: 0,
    dislikes: 0,
  },
];

const BookDetailProductPage = () => {
  const [comments, setComments] = useState(commentsData);
  const [comment, setComment] = useState("");

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        user: "Bạn",
        avatar: "path_to_your_avatar",
        level: 1,
        chapter: "Mới",
        text: comment,
        time: "Vừa xong",
        likes: 0,
        dislikes: 0,
      };
      setComments([newComment, ...comments]);
      setComment("");
    }
  };

  const imgs = [feat1Img, feat2Img, feat3Img];
  
  return (
    <>
      <BreadCrumb name="Chi tiết sản phẩm" />
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 product-detail-pic">
            <img className="img1" src={feat3Img} alt="product-pic" />
            <div className="main">
              {imgs.map((item, key) => (
                <img src={item} alt="product-pic" key={key} />
              ))}
            </div>
          </div>
          <div className="col-lg-6 col-md-12 product-detail-text">
            <h2>Thư tình gửi một người</h2>
            <div className="seen-icon">
              <FaEye />
              {`10 (lượt đã xem)`}
            </div>
            <p>Thư tình gửi một người là tập sách lần đầu tiên công bố những bức thư tình viết tay của nhạc sĩ Trịnh Công Sơn gửi riêng một người: Ngô Vũ Dao Ánh.</p>
            <Quantity hasAddToCart={true} />
            <ul>
              <li><b>Tình trạng:</b> <span>Còn hàng</span></li>
              <li><b>Số lượng:</b> <span>20</span></li>
              <li><b>Chia sẻ:</b> <span><FaFacebook /><FaInstagram /></span></li>
            </ul>
          </div>
        </div>
        <div className="chapter-list">
          <h2>Danh Sách Chương</h2>
          <ul>
            {chaptersData.map((chapter) => (
              <li key={chapter.id} className="chapter-item">
                <span className="chapter-title">{chapter.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="comments-section">
          <h2>Bình Luận ({comments.length})</h2>
          <div className="comment-box">
            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Nhập bình luận của bạn..." />
            <button onClick={handleCommentSubmit}>Gửi</button>
          </div>
          <div className="comment-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <img src={comment.avatar} alt="avatar" className="comment-avatar" />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-user" style={{ color: comment.level > 5 ? "#40c057" : "#ff6b6b" }}>{comment.user}</span>
                    <span className="comment-level">Cấp {comment.level}</span>
                    <span className="comment-chapter">Chapter {comment.chapter}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-footer">
                    <span className="comment-time">{comment.time}</span>
                    <div className="comment-actions">
                      <FaThumbsUp className="icon" /> {comment.likes}
                      <FaThumbsDown className="icon" /> {comment.dislikes}
                      <FaReply className="icon" /> Trả lời
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="section-title">
          <h2>Sản phẩm tương tự</h2>
        </div>
        <div className="row">
          {featProducts.all.products.map((item, key) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={key}>
              <ProductCard img={item.img} name={item.name} />
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};

export default memo(BookDetailProductPage);
