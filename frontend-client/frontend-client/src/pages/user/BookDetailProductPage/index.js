import { memo } from 'react';
import "./style.scss";
import BreadCrumb from '../theme/breadCrumb';
import feat1Img from "assets/user/image/categories/sach1.webp";
import feat2Img from "assets/user/image/categories/sach2.webp";
import feat3Img from "assets/user/image/categories/sach3.webp";
import { FaEye, FaFacebook, FaInstagram } from 'react-icons/fa6';
import { ProductCard } from 'component';
import { featProducts } from 'utils/common';
import Quantity from 'component/Quantity';
const BookDetailProductPage = () => {

  const imgs = [feat1Img, feat2Img, feat3Img];
  return (
    <>
      <BreadCrumb name="Chi tiết sản phẩm" />
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 product-detail-pic">
            <img className="img1" src={feat3Img} alt="product-pic" />
            <div className="main">
              {imgs.map((item, key) => (
                <img src={item} alt="product-pic" key={key} />
              ))}
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 product-detail-text">
            <h2>Thư tình gửi một người</h2>
            <div className="seen-icon">
              <FaEye />
              {`10 (lượt đã xem)`}
            </div>
            <p>Thư tình gửi một người là tập sách lần đầu tiên công bố những bức thư tình viết tay của nhạc sĩ Trịnh Công Sơn gửi riêng một người: Ngô Vũ Dao Ánh. Những lá thư được giữ gìn suốt hơn nửa thế kỷ.</p>
            <Quantity hasAddToCart={true} />
            <ul>
              <li>
                <b>Tình trạng:</b> <span>Còn hàng</span>
              </li>
              <li>
                <b>Số lượng:</b> <span>20</span>
              </li>
              <li>
                <b>Chia sẻ:</b> {" "}<span>
                  <FaFacebook />
                  <FaInstagram />
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="product-detail-tab">
          <h4>Thong tin chi tiet</h4>
          <div>
            <ul>
              <li><p>TTO xin được trích đăng 10 bức thư trong tập Thư tình gửi một người. Các bức thư sẽ xuất hiện lúc 20g mỗi đêm trên TTO, mời bạn đón đọc.</p></li>
            </ul>
            <p>TTO xin được trích đăng 10 bức thư trong tập Thư tình gửi một người. Các bức thư sẽ xuất hiện lúc 20g mỗi đêm trên TTO, mời bạn đón đọc.</p>
            <ul>
              <li><p>TTO xin được trích đăng 10 bức thư trong tập Thư tình gửi một người. Các bức thư sẽ xuất hiện lúc 20g mỗi đêm trên TTO, mời bạn đón đọc.</p></li>
            </ul>
          </div>
        </div>
        <div className="section-title">
          <h2>San pham tuong tu</h2>
        </div>
        <div className="row">
          {
            featProducts.all.products.map((item, key) => (
              <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" key={key}>
                <ProductCard img={item.img} name={item.name} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
export default memo(BookDetailProductPage);
