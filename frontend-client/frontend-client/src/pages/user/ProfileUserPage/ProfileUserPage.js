import React from "react";
import Sidebar from "../../../component/ProfileUser/SideBar/sideBar";
import ProfileInfo from "../../../component/ProfileUser/ProfileInfor/ProfileInfor";
import "./ProfileUserPage.scss";

const ProfileUserPage = () => {
  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        <ProfileInfo />
      </div>
    </div>
  );
};

export default ProfileUserPage;
