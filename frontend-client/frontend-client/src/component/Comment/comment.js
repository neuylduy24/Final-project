import { memo } from 'react';
import './comment.scss';

const Comment = ({ hasComment = true }) => {
    return (
        <div className="comment-section">
        {hasComment && <h3>📖 Comment</h3>}
        {<input placeholder="Enter your comment" />}
        {<button className="btn btn-comment">Submit</button>}
      </div>
    );
}

export default memo(Comment);
