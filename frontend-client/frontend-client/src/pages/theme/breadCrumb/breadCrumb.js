import { memo, useCallback, useEffect, useState } from "react";
import "./bread.scss";
import { Link, useParams } from "react-router-dom";
import { ROUTERS } from "utils/path";
import axios from "axios";

const BreadCrumb = ({ name }) => {
  const parts = name.split(" / ");
  const { id } = useParams();
  const [ setChapterList] = useState([]);
  const fetchChapters = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/chapters?bookId=${id}`
      );
      const filteredChapters = response.data.filter(
        (chapter) => chapter.bookId === id
      );
      setChapterList(filteredChapters);
    } catch (error) {
    }
  }, [id, setChapterList]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);
  return (
    <div className="breadCrumb">
      <div className="breadCrumb_text">
        <div className="breadCrumb_option">
          <ul>
            <li className="link">
              <Link to={ROUTERS.USER.HOME}>Home</Link>
            </li>
            <li className="book-title">
              <Link to={ROUTERS.USER.BOOKDETAIL.replace(":id", id)}>
                {parts[0]}
              </Link>
            </li>
            {parts[1] && <li>{parts[1]}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default memo(BreadCrumb);
