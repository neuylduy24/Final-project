import { memo } from 'react';
import BreadCrumb from '../theme/breadCrumb';
import "./style.scss";
import { formater } from 'utils/fomater';
import { Quantity } from 'component';
import { FaCircleXmark } from 'react-icons/fa6';
import { ROUTERS } from 'utils/router';
import { useNavigate } from 'react-router-dom';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <BreadCrumb name="Gio hang" />
      <div className="container">
        <div className="table-cart">
          <table>
            <thead>
              <tr>
                <th>Ten san pham</th>
                <th>Don gia</th>
                <th>So luong san pham</th>
                <th>Thanh tien</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="shopping-cart-item">
                  <img src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png" alt="product-pic" />
                  <h4>Ten san pham 1</h4>
                </td>
                <td>{formater(10000)}</td>
                <td><Quantity quantity="2" hasAddToCart={false} /></td>
                <td>{formater(900000)}</td>
                <td className="item-close">
                  <FaCircleXmark />
                </td>
              </tr>
              <tr>
                <td className="shopping-cart-item">
                  <img src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png" alt="product-pic" />
                  <h4>Ten san pham 2</h4>
                </td>
                <td>{formater(10000)}</td>
                <td><Quantity quantity="2" hasAddToCart={false} /></td>
                <td>{formater(900000)}</td>
                <td className="item-close">
                  <FaCircleXmark />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div className="shopping-continue">
              <h3>Ma giam gia</h3>
              <div className="shopping-discount">
                <input type="text" placeholder="Nhap ma giam gia" />
                <button className="button-submit">Ap dung</button>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div className="shopping-checkout">
              <h2>Tong don:</h2>
              <ul>
                <li>So luong:<span>{2}</span></li>
                <li>Thanh tien:<span>{formater(900000)}</span></li>
              </ul>
              <button type="submit" className="button-submit" onClick={() => navigate(ROUTERS.USER.CHECKOUT)}>Thanh toan</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default memo(ShoppingCartPage);
