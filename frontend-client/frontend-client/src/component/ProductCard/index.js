import { memo } from 'react';
import './style.scss';
import { FaRegEye } from 'react-icons/fa6';

import { generatePath, Link } from 'react-router-dom';
import { ROUTERS } from 'utils/router';
const ProductCard = ({ img, name }) => {
    return (
        <>
            <div className="featured_item pd-r-10">
                <div className="featured_item_img" style={{ backgroundImage: `url(${img})` }}>
                    <ul className="featured_item_img_hover">
                        <li>
                            <FaRegEye />
                        </li>
                    </ul>
                </div>
                <div className="featured_item_text">
                    <h5>
                        <Link to={generatePath(ROUTERS.USER.BOOKDETAIL, { id: 1 })}>{name}</Link>
                    </h5>
                </div>
            </div>
        </>
    );
}

export default memo(ProductCard);