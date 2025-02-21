import React, { useState } from 'react';
import "./style.scss";
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

const UserManagementAdPage = () => {

  return (
    <div className="container">
      <div className="orders">
        <h2>Quản lý người dùng</h2>

        <div className="orders_content">
          <table className="orders_table">
            <thead>
              <tr>
                <th>Tên người dùng</th>
                <th>Email</th>
              </tr>
            </thead>
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
};
export default UserManagementAdPage;
