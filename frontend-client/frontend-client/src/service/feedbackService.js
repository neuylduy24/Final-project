import axios from "axios";

const API_URL = "https://api.it-ebook.io.vn/api/feedbacks";

const getAverageRating = (bookId) => {
  return axios.get(`${API_URL}/average-rating/${bookId}`)
    .then(res => res.data);
};

const addRating = (bookId, rating) => {
  return axios.post(API_URL, { bookId, rating })
    .then(res => res.data);
};

export default { getAverageRating, addRating };
