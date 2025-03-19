import { memo } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import { ROUTERS } from 'utils/router';
const breadCrumb = (props) => {
  return <div className="breadCrumb">
    <div className="breadCrumb_text">
      <div className="breadCrumb_option">
        <ul>
          <li className="link">
            <Link to={ROUTERS.USER.HOME}>Trang chủ</Link>
          </li>
          <li>
            {props.name}
          </li>
        </ul>
      </div>
    </div>
  </div>
};
export default memo(breadCrumb);
