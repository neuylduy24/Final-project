import { useEffect, useState } from "react";
import axios from "axios";
import "./styleForm.scss"

const useStatistics = () => {
  const [bookStats, setBookStats] = useState([]);
  const [userStats, setUserStats] = useState({ adminCount: 0, authorCount: 0, readerCount: 0 });
  const [commentStats, setCommentStats] = useState([]);
  const [viewTrends, setViewTrends] = useState([]);

  useEffect(() => {
    axios.get("/api/statistics/books").then(res => setBookStats(res.data)).catch(() => {});
    axios.get("/api/statistics/users").then(res => setUserStats(res.data)).catch(() => {});
    axios.get("/api/statistics/comments").then(res => setCommentStats(res.data)).catch(() => {});
    axios.get("/api/statistics/view-trends").then(res => setViewTrends(res.data)).catch(() => {});
  }, []);

  return { bookStats, userStats, commentStats, viewTrends };
};

export default useStatistics;
