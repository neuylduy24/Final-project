import { memo } from "react";
import { Link } from "react-router-dom";

const MenuItem = ({ menu }) => (
    <ul>
    {menu.map((menuItem, menuKey) => (
      <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
        <Link to={menuItem?.path}>{menuItem?.name}</Link>
        {menuItem.child && (
          <ul className="header_menu_dropdown">
            {menuItem.child.map((childItem, childKey) => (
              <li key={`${menuKey}-${childKey}`}>
                <Link to={childItem.path}>{childItem.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
);

export default memo(MenuItem);
