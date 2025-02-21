import { memo } from 'react';
import BreadCrumb from '../theme/breadCrumb';
import "./style.scss";
import { formater } from 'utils/fomater';

const checkoutPage = () => {
  return (
    <>
      <BreadCrumb name="Thanh toan" />
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div className="checkout-input">
              <label>Ho va ten: <span className="required">*</span></label>
              <input type="text" placeholder="Nhap ho va ten" />
            </div>
            <div className="checkout-input">
              <label>Dia chi: <span className="required">*</span></label>
              <input type="text" placeholder="Nhap dia chi" />
            </div>
            <div className="checkout-input-group">
              <div className="checkout-input">
                <label>So dien thoai: <span className="required">*</span></label>
                <input type="text" placeholder="Nhap so dien thoai" />
              </div>
              <div className="checkout-input">
                <label>Email: <span className="required">*</span></label>
                <input type="text" placeholder="Nhap email" />
              </div>
            </div>
            <div className="checkout-input">
              <label>Ghi chu:</label>
              <textarea rows={15} placeholder="Nhap ghi chu"></textarea>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div className="checkout-order">
              <h3>Don hang</h3>
              <ul>
                <li>
                  <span>San pham 1</span>
                  <b>{formater(30000)}(2)</b>
                </li>
                <li>
                  <span>San pham 2</span>
                  <b>{formater(50000)}(4)</b>
                </li>
                <li>
                  <span>San pham 3</span>
                  <b>{formater(70000)}(6)</b>
                </li>
                <li>
                  <span>San pham 4</span>
                  <b>{formater(90000)}(8)</b>
                </li>
                <li>
                <h4>Ma giam gia</h4>
                <b>VNPAY20</b>
                </li>
                <li className="checkout-order-subtotal">
                  <h3>Tong don</h3>
                  <b>{formater(900000)}</b>
                </li>
              </ul>
              <button type="button" className="button-submit">Dat hang</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default memo(checkoutPage);
