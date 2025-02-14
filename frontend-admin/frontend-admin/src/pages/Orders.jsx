import { useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([
    { id: 1, customer: "Nguyễn Văn A", total: "$50", status: "Đang xử lý" },
    { id: 2, customer: "Trần Thị B", total: "$30", status: "Đã giao" },
    { id: 3, customer: "Lê Văn C", total: "$70", status: "Đã hủy" },
  ]);

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(order => (order.id === id ? { ...order, status: newStatus } : order)));
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Quản lý Đơn hàng</h1>
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Khách hàng</th>
            <th className="border p-2">Tổng tiền</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">{order.customer}</td>
              <td className="border p-2">{order.total}</td>
              <td className="border p-2">
                <select
                  className="border p-1"
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã giao">Đã giao</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </td>
              <td className="border p-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 mx-1"
                  onClick={() => deleteOrder(order.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
