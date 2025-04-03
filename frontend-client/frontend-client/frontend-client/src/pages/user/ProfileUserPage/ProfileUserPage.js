import React from "react";
import Sidebar from "../../../component/ProfileUser/SideBar/sideBar";
import AvatarUser from "../../../component/ProfileUser/AvtUser/avtUser";
import ProfileInfo from "../../../component/ProfileUser/ProfileInfor/ProfileInfor";
import "./ProfileUserPage.scss";

const ProfileUserPage = () => {
  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        <AvatarUser />
        <ProfileInfo />
      </div>
    </div>
  );
};

export default ProfileUserPage;
