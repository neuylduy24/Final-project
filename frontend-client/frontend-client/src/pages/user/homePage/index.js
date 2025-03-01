import React from 'react';
import "./style.scss";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import sach1Img from "assets/user/image/categories/sach1.webp";
import sach2Img from "assets/user/image/categories/sach2.webp";
import sach3Img from "assets/user/image/categories/sach3.webp";
import sach4Img from "assets/user/image/categories/sach4.webp";
import sach5Img from "assets/user/image/categories/sach5.jpg";
import feat1Img from "assets/user/image/categories/sach1.webp";
import feat2Img from "assets/user/image/categories/sach2.webp";
import feat3Img from "assets/user/image/categories/sach3.webp";
import feat4Img from "assets/user/image/categories/sach4.webp";
import feat5Img from "assets/user/image/categories/sach5.jpg";
import feat6Img from "assets/user/image/categories/sach6.jpg";
import feat7Img from "assets/user/image/categories/sach7.webp";
import feat8Img from "assets/user/image/categories/sach8.webp";
import { ProductCard } from 'component';

const HomePage = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const sliderItems = [
    {
      bgImg: sach1Img,
    },
    {
      bgImg: sach2Img,
    },
    {
      bgImg: sach3Img,
    },
    {
      bgImg: sach4Img,
    },
    {
      bgImg: sach5Img,
    },
    {
      bgImg: sach4Img,
    },
  ]

  const featProducts = {
    all: {
      title: "Toàn bộ",
      products: [
        {
          img: feat1Img,
          name: "Đắc Nhân Tâm",
        },
        {
          img: feat2Img,
          name: "Doraemon",
          
        }, 
        {
          img: feat3Img,
          name: "Toán 10",
          
        },{
          img: feat4Img,
          name: "Conan",
          
        }, 
        {
          img: feat5Img,
          name: "Người Phụ Nữ Tự Do",
          
        },
        {
          img: feat1Img,
          name: "Đắc Nhân Tâm",
          
        },
        {
          img: feat6Img,
          name: "Thư Cho Em",
          
        }, 
        {
          img: feat7Img,
          name: "Lý Do Để Sống Tiếp",
          
        }, 
        {
          img: feat8Img,
          name: "Sống Thay Phần Mẹ",
          
        },
      ]
    },
    Comic: {
      title: "Truyện tranh",
      products: [
        {
          img: feat1Img,
          name: "Doraemon",
          price: 16000,
        },
        {
          img: feat5Img,
          name: "Người Phụ Nữ Tự Do",
          price: 29000,
        },
        {
          img: feat6Img,
          name: "Thư Cho Em",
          price: 12000,
        }, 
        {
          img: feat7Img,
          name: "Lý Do Để Sống Tiếp",
          price: 20000,
        }
      ]
    },
    textBook: {
      title: "Sách giáo khoa",
      products: [
        {
          img: feat1Img,
          name: "Toán 10",
          price: 16000,
        },
        {
          img: feat3Img,
          name: "Toán 10",
          price: 12000,
        },{
          img: feat4Img,
          name: "Conan",
          price: 29000,
        }, 
        {
          img: feat5Img,
          name: "Người Phụ Nữ Tự Do",
          price: 20000,
        },
      ]
    },
    Literature: {
      title: "Văn học",
      products: [
        {
          img: feat1Img,
          name: "Doraemon",
          price: 16000,
        },
        {
          img: feat5Img,
          name: "Người Phụ Nữ Tự Do",
          price: 29000,
        },
        {
          img: feat6Img,
          name: "Thư Cho Em",
          price: 12000,
        }, 
        {
          img: feat7Img,
          name: "Lý Do Để Sống Tiếp",
          price: 20000,
        }
      ]
    },
    mentality: {
      title: "Tâm lý và kĩ năng",
      products: [
        {
          img: feat1Img,
          name: "Doraemon",
          price: 16000,
        },
        {
          img: feat2Img,
          name: "Doraemon",
          price: 40000,
        }, 
        {
          img: feat3Img,
          name: "Toán 10",
          price: 60000,
        },{
          img: feat4Img,
          name: "Conan",
          price: 80000,
        }
      ]
    },
    Biography: {
      title: "Tiểu sử hồi kí",
      products: [
        {
          img: feat1Img,
          name: "Doraemon",
          price: 16000,
        },
        {
          img: feat5Img,
          name: "Người Phụ Nữ Tự Do",
          price: 29000,
        },
        {
          img: feat6Img,
          name: "Thư Cho Em",
          price: 12000,
        }, 
        {
          img: feat7Img,
          name: "Lý Do Để Sống Tiếp",
          price: 20000,
        }
      ]
    },
    Religious: {
      title: "Tôn giáo",
      products: [
        {
          img: feat1Img,
          name: "Doraemon",
          price: 16000,
        },
        {
          img: feat2Img,
          name: "Doraemon",
          price: 40000,
        }, 
        {
          img: feat3Img,
          name: "Toán 10",
          price: 60000,
        },{
          img: feat4Img,
          name: "Conan",
          price: 80000,
        }
      ]
    }
  }

  const renderFeaturedProducts = (data) => {
    const tabList = [];
    const tabPanels = [];
    Object.keys(data).forEach((key, index) => {
      tabList.push(<Tab key={index}>{data[key].title}</Tab>)

      const tabPanel = [];
      data[key].products.forEach((item, j) => {
        tabPanel.push(
          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" key={j}>
            <ProductCard name={item.name} img={item.img} price={item.price}/>
          </div>
        )
      })
      tabPanels.push(tabPanel);
    })
    return (
      <Tabs>
        <TabList>{tabList}</TabList>

        {
          tabPanels.map((item) => (
            <TabPanel>
              <div className="row">{item}</div>
            </TabPanel>
          ))}
      </Tabs>
    )
  }
  return (
    <>    
      <div className="container container_categories_slider">
        <Carousel responsive={responsive} className="categories_slider">
          {sliderItems.map((item, key) => (
            <div className="categories_slider_item" style={{ backgroundImage: `url(${item.bgImg})` }} key={key} >
              <p>{item.name}</p>
            </div>
          ))}
        </Carousel>
      </div>

      <div className="container">
        <div className="featured">
          <div className="section-title">
            <h2>Sản phẩm nổi bật</h2>
          </div>
          {renderFeaturedProducts(featProducts)}
        </div>
      </div>
    </>
  );
}
export default HomePage;
