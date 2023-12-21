import React from "react";

import default_avatar from "../../assets/defaultAvatar_profile.png";
import profile_settings from "../../assets/icons/profile_settings.svg";

const Profile = () => {
    return (
        <div className="profile">
            <img 
                src={profile_settings} 
                className="button_profile_settings"
                alt="button_profile_settings"
            />  

            <img 
                src={default_avatar} 
                className="avatar_profile" 
                alt="avatar profile" 
            />

            <h2 className="user-name">
                User
            </h2>
        </div>
    )
}


export default Profile; 