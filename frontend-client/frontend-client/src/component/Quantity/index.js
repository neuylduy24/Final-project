import { memo } from 'react';
import './style.scss';

const Quantity = ({ hasFollow = true, hasComment = true }) => {
    return (
        <div className="book-actions">
        {hasFollow && <button type="button" className="btn btn-read">📖 Read to first</button>}
        {hasFollow && <button type="button" className="btn btn-follow">⭐ Follow</button>}
      </div>
    );
}

export default memo(Quantity);
