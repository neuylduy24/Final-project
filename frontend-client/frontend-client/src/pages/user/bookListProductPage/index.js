import { memo } from 'react';
import "./style.scss";
import BreadCrumb from '../theme/breadCrumb';
import { Link } from 'react-router-dom';
import { categories } from '../theme/header';
import { ROUTERS } from 'utils/router';
import feat1Img from "assets/user/image/categories/sach1.webp";
import feat2Img from "assets/user/image/categories/sach2.webp";
import feat3Img from "assets/user/image/categories/sach3.webp";
import feat4Img from "assets/user/image/categories/sach4.webp";
import feat5Img from "assets/user/image/categories/sach5.jpg";
import feat6Img from "assets/user/image/categories/sach6.jpg";
import feat7Img from "assets/user/image/categories/sach7.webp";
import feat8Img from "assets/user/image/categories/sach8.webp";
import { ProductCard } from 'component';


const BookListProductPage = () => {
  const sorts = [
    "Giá thấp đến cao",
    "Giá cao đến thấp",
    "Mới đến cũ",
    "Cũ đến mới",
    "Bán chạy nhất",
    "Đang giảm giá",
  ];
  const products = [
    {
      img: feat1Img,
      name: "Doraemon"
    },
    {
      img: feat2Img,
      name: "Đắc Nhân Tâm"
    },
    {
      img: feat3Img,
      name: "Toán 10"
    },
    {
      img: feat4Img,
      name: "Conan"
    },
    {
      img: feat5Img,
      name: "Người Phụ Nữ Tự Do"
    },
    {
      img: feat6Img,
      name: "Đắc Nhân Tâm"
    },
    {
      img: feat7Img,
      name: "Thư Cho Em"
    },
    {
      img: feat8Img,
      name: "Lý Do Để Sống Tiếp"
    }
  ]
  return (
    <>
      <BreadCrumb name="Danh sách sản phẩm" />
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-12 col-sm-12">
            <div className="sidebar">
              <div className="sidebar_item">
                <h2>Tim kiem</h2>
                <input type="text" />
              </div>
              <div className="sidebar_item">
                <h2>Muc gia</h2>
                <div className="price-range-wrap">
                  <div>
                    <p>Từ:</p>
                    <input type="number" min={0} />
                  </div>
                  <div>
                    <p>Đến:</p>
                    <input type="number" min={0} />
                  </div>
                </div>
              </div>
              <div className="sidebar_item">
                <h2>Sap xep</h2>
                <div className="tags">
                  {sorts.map((item, key) => (
                    <div className={`tag ${key === 0 ? "active" : ""}`} key={key}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="sidebar_item">
                <h2>Thể loại khác</h2>
                <ul>
                  {categories.map((name, key) => (
                    <li key={key}><Link to={ROUTERS.USER.BOOKLIST}>{name}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-md-12 col-sm-12">
            <div className="row">
              {
                products.map((item, key) => (
                  <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" key={key}>
                    <ProductCard name={item.name} img={item.img} price={item.price} />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(BookListProductPage);
