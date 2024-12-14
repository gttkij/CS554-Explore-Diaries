import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { CiEdit } from "react-icons/ci";

import { TbLockPassword } from "react-icons/tb";
import "./Sidebar.css"; // Import the CSS file

export default function SideBar() {
  // const userName = props.userName;

  return (
    <nav className="sidebar-container">
      <div className="sidebar-content">
        <div className="avatar-container">
          <Stack direction="row" spacing={2}>
            <Avatar
              style={{ width: 100, height: 100 }}
              alt="username"
              src="user-page/src/assets/react.svg"
            />
          </Stack>
        </div>
        <div className="username-container">
          <p>Username</p>
        </div>

        <div className="menu-container">
          <ul className="menu-list">
            <li>
              <a className="menu-item">
                <div className="icon-container">
                  <CiEdit />
                </div>
                <div>Edit Profile</div>
              </a>
            </li>

            <li>
              <a className="menu-item">
                <div className="icon-container">
                  <TbLockPassword />
                </div>
                <div>Change Password</div>
              </a>
            </li>
          </ul>

          <ul className="menu-list">
            <li>
              <a className="menu-item">
                <div className="icon-container"></div>
                <div>Sign out</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
