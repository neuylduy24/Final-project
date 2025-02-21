import { memo } from 'react';
import './style.scss';
const Quantity = ({ hasAddToCart, hasToComment = true }) => {
    return (
        <div className="quantity-container">
            {
                hasAddToCart && (
                    <button type="submit" className="button-follow">Theo dõi</button>
                )
            }
            {
                hasToComment && (
                    <button type="submit" className="button-comment">Comment</button>
                )
            }
        </div>
    );
}

export default memo(Quantity);