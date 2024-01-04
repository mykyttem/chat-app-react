import React, { useState } from "react";

// files
import default_avatar from "../../../assets/defaultAvatar_profile.png";
import profile_settings from "../../../assets/icons/profile_settings.svg";
import Settings from "./SettingsProfile";


const Profile = ({ user }) => {

    // current data user
    const { displayName, photoURL } = user;    

    // modal window for settings 
    const [showModalWindow, setModalWindow] = useState(false);

    const openModal_Settings = () => {
        setModalWindow(true);
    };


    return (
        <div className="profile">
            <img 
                src={profile_settings} 
                className="button_profile_settings_icon"
                alt="button_profile_settings"
                onClick={openModal_Settings}
            />
          

            {showModalWindow && <Settings user={user} setModalWindow={setModalWindow} /> }
        
        
            <img 
                src={photoURL || default_avatar} 
                className="avatar_profile" 
                alt="avatar profile" 
            />

            <h2 className="user-name">
                {displayName}
            </h2>
        </div>
    )
}


export default Profile; 