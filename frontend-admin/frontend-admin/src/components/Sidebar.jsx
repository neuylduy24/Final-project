import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold">Admin Panel</h2>
      <ul className="mt-4">
        <li className="p-2 hover:bg-gray-700">
          <Link to="/">Dashboard</Link>
        </li>
        <li className="p-2 hover:bg-gray-700">
          <Link to="/books">Quản lý Sách</Link>
        </li>
        <li className="p-2 hover:bg-gray-700">
          <Link to="/categories">Danh mục</Link>
        </li>
        <li className="p-2 hover:bg-gray-700">
          <Link to="/orders">Đơn hàng</Link>
        </li>
        <li className="p-2 hover:bg-gray-700">
          <Link to="/users">Người dùng</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
