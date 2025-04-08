import axios from 'axios';
import { useState } from 'react';

function BookImageUploadPage() {
  const [bookId, setBookId] = useState('');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file || !bookId) {
      setMessage('Vui lòng chọn ảnh và nhập Book ID');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `https://api.it-ebook.io.vn/api/books/${bookId}/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setMessage(response.data || 'Upload ảnh thành công!');
    } catch (error) {
      if (error.response) {
        setMessage(
          error.response.data?.message ||
          error.response.data?.error ||
          'Đã xảy ra lỗi khi upload ảnh.'
        );
      } else {
        setMessage('Đã xảy ra lỗi khi upload ảnh.');
      }
    }
  };

  const handleViewImage = async () => {
    if (!bookId) {
      setMessage('Vui lòng nhập Book ID');
      return;
    }

    try {
      const response = await axios.get(`https://api.it-ebook.io.vn/api/books/${bookId}/image`, {
        responseType: 'arraybuffer',
      });

      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      setImageUrl(`data:image/jpeg;base64,${base64}`);
      setMessage('');
    } catch (error) {
      setMessage('Không thể tải ảnh.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-xl font-bold mb-4">Upload Ảnh cho Sách</h2>

      <input
        type="text"
        placeholder="Nhập Book ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        className="border rounded w-full p-2 mb-4"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <div className="flex gap-2">
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload Ảnh
        </button>
        <button
          onClick={handleViewImage}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Xem Ảnh
        </button>
      </div>

      {message && <p className="mt-4 text-red-500">{message}</p>}

      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Book" className="max-w-full rounded border" />
        </div>
      )}
    </div>
  );
}

export default BookImageUploadPage;
