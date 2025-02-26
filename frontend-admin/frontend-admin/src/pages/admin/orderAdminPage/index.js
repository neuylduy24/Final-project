import { memo, useEffect, useState } from 'react';
import './style.scss';
import { FaArrowLeftLong, FaArrowRightLong, FaCaretDown } from "react-icons/fa6";
import { formater } from 'utils/fomater';


const STATUS = {
  ORDERED: {
    key: "ORDERED",
    label: "Đã đặt",
    className: "orders_dropdown-item"
  },
  PREPARING: {
    key: "PREPARING",
    label: "Dang chuẩn bị",
    className: "orders_dropdown-item"
  },
  DIVIVERED: {
    key: "DIVIVERED",
    label: "Đã giao hàng",
    className: "orders_dropdown-item"
  },
  CANCLED: {
    key: "CANCLED",
    label: "Đã hủy",
    className: "orders_dropdown-item orders_dropdown-item--danger"
  },
}
const OrderAdminPage = () => {

  const dataOrders = [
    {
      id: 1,
      total: 100000,
      customerName: 'John Doe',
      date: new Date(),
      status: 'Đã giao hàng'
    },
    {
      id: 2,
      total: 200000,
      customerName: 'Jane Doe',
      date: new Date(),
      status: 'Đang chờ xử lý'
    },
    {
      id: 3,
      total: 300000,
      customerName: 'David Doe',
      date: new Date(),
      status: 'Đã nhận hàng'
    }
  ];
  const [activedDropdown, setActiveDropdown] = useState(null);
  useEffect(() => {
    const handleClickOutsideDropdown = (event) => {
      const isDropdown = event.target.closest(".orders_dropdown");
      if (!isDropdown) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
  }, [])
  return (
    <div className="container">
      <div className="orders">
        <h2>Quản lí đơn hàng:</h2>

        <div className="orders_content">
          <table className="orders_table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Tổng đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {dataOrders.map((item, i) => (
                <tr key={i}>
                  <td>{item.id}</td>
                  <td>{formater(item.total)}</td>
                  <td>{item.customerName}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>
                    <div className="orders_dropdown">
                      <button className={`orders_action-button`}
                        onClick={() => setActiveDropdown(item.id)}
                      >
                        Đã đặt
                        <span className="orders_dropdown_arrow"><FaCaretDown /></span>
                      </button>
                      {
                        activedDropdown === item.id && (
                          <div className="orders_dropdown_menu">
                            {Object.values(STATUS).map((status) => (
                              <button className={status.className} key={status.key} onClick={() => setActiveDropdown(null)}>
                                {status.label}
                              </button>
                            ))}
                          </div>
                        )
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="orders_footer">
          <div className="orders_pagnigation">
            <div className="orders_page-number">
              <button className="orders-page-button"><FaArrowLeftLong /></button>
              <button className="orders-page-button orders-page-button-active">1</button>
              <button className="orders-page-button">2</button>
              <button className="orders-page-button">3</button>
              <button className="orders-page-button">4</button>
              <button className="orders-page-button">5</button>
              <button className="orders-page-button">6</button>
              <button className="orders-page-button"><FaArrowRightLong /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(OrderAdminPage);
