import { memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/path";
import "./navigationChapter.scss";

const NavigationChapter = ({ chapterList }) => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();

  // Kiểm tra nếu danh sách chương chưa có dữ liệu
  if (!chapterList || chapterList.length === 0) {
    return <p>Loading navigation...</p>;
  }

  // Tìm vị trí của chương hiện tại trong danh sách
  const chapterIndex = chapterList.findIndex((chap) => chap.id === chapterId);

  // Nếu chương hiện tại không tìm thấy, hiển thị lỗi
  if (chapterIndex === -1) {
    return <p>Chapter not found!</p>;
  }

  const handlePrevChapter = () => {
    if (chapterIndex > 0) {
      const prevChapter = chapterList[chapterIndex - 1];
      navigate(
        ROUTERS.USER.CHAPTERDETAIL.replace(":id", id).replace(
          ":chapterId",
          prevChapter.id
        )
      );
    }
  };

  const handleNextChapter = () => {
    if (chapterIndex < chapterList.length - 1) {
      const nextChapter = chapterList[chapterIndex + 1];
      navigate(
        ROUTERS.USER.CHAPTERDETAIL.replace(":id", id).replace(
          ":chapterId",
          nextChapter.id
        )
      );
    }
  };

  return (
    <div className="chapter-navigation">
      <button
        onClick={handlePrevChapter}
        disabled={chapterIndex === 0}
        className="nav-button prev-button"
      >
        ←
      </button>
      <input
        className="chapter-input"
        type="text"
        value={chapterList[chapterIndex].title}
        readOnly
      />
      <button
        onClick={handleNextChapter}
        disabled={chapterIndex === chapterList.length - 1}
        className="nav-button next-button"
      >
        →
      </button>
    </div>
  );
};

export default memo(NavigationChapter);
