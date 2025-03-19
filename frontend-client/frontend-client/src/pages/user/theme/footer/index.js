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
            <Link to={ROUTERS.USER.HOME}>
                <img src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png" alt="footer__about_logo" />
              </Link>
            <ul>
              <li>Address: Số 1 Trịnh Văn Bô</li>
              <li>Phone: 0987654321</li>
              <li>Email: BookStore@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 col-xl-12">
          <div className="footer__widget">
            <ul>
              <li>
                <Link to="">Contact</Link>
              </li>
              <li>
                <Link to="">About Us</Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link to="">Account Information</Link>
              </li>
              <li>
                <Link to="">Stories Follow</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 col-xl-12">
          <div className="footer_widget">
            <form action="#">
              <div className="input-group">
                <input type="text" placeholder="Enter your email" />
                <button type="submit" className="button-submit">sign in</button>
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
