import { memo } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram } from 'react-icons/fa6';
import { ROUTERS } from 'utils/router';
const Footer = () => {
  return <footer className="footer">
    <div className="container">
      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 col-xl-12">
          <div className="footer__about">
<<<<<<< Updated upstream
          <Link to={ROUTERS.USER.HOME}>
=======
            <Link to={ROUTERS.USER.HOME}>
>>>>>>> Stashed changes
                <img src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png" alt="footer__about_logo" />
              </Link>
            <ul>
              <li>Địa chỉ: Số 1 Trịnh Văn Bô</li>
              <li>Phone: 0987654321</li>
              <li>Email: BookStore@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 col-xl-12">
          <div className="footer__widget">
            <h6>Cửa Hàng</h6>
            <ul>
              <li>
                <Link to="">Liên Hệ</Link>
              </li>
              <li>
                <Link to="">Thông tin về chúng tôi</Link>
              </li>
              <li>
                <Link to="">Sản phẩm kinh doanh</Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link to="">Thông tin tài khoản</Link>
              </li>
              <li>
                <Link to="">Giỏ hàng</Link>
              </li>
              <li>
                <Link to="">Danh sách theo dõi</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 col-xl-12">
          <div className="footer_widget">
            <h6>Khuyến mãi và ưu đãi</h6>
            <p>Đăng ký nhận thông tin khuyến mãi tại đây</p>
            <form action="#">
              <div className="input-group">
                <input type="text" placeholder="Nhập email của bạn" />
                <button type="submit" className="button-submit">Đăng ký</button>
              </div>
              <div className="footer_widget_social">
                <div>
                  <FaFacebook />
                </div>
                <div>
                  <FaInstagram />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </footer>;
};
export default memo(Footer);
