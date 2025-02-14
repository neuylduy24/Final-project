import { useState } from "react";

const Books = () => {
  const [books, setBooks] = useState([
    { id: 1, title: "Dune", author: "Frank Herbert", price: "$20" },
    { id: 2, title: "1984", author: "George Orwell", price: "$15" },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Quản lý Sách</h1>
      <button className="bg-blue-500 text-white px-4 py-2 my-4">Thêm Sách</button>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên sách</th>
            <th className="border p-2">Tác giả</th>
            <th className="border p-2">Giá</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="border p-2">{book.id}</td>
              <td className="border p-2">{book.title}</td>
              <td className="border p-2">{book.author}</td>
              <td className="border p-2">{book.price}</td>
              <td className="border p-2">
                <button className="bg-yellow-500 text-white px-2 py-1 mx-1">Sửa</button>
                <button className="bg-red-500 text-white px-2 py-1">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
