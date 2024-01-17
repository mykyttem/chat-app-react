import React, { useState, useEffect } from "react";

// firebase
import { fetchPhotoURL } from "../../../firebase/getPhoto";

// Import image assets
import default_avatar from "../../../assets/defaultAvatar_profile.png";
import profile_settings from "../../../assets/icons/profile_settings.svg";
import Settings from "./SettingsProfile";


/*
 * Functional Component: Profile
 * Displays the user's profile information and settings.
*/

const Profile = ({ user }) => {
    // user data
    const { displayName, photoURL } = user;

    // State to hold the user photo
    const [photo, setPhoto] = useState(null);

    // State for modal window visibility
    const [showModalWindow, setModalWindow] = useState(false);

    // Function to open the settings modal
    const openModal_Settings = () => {
        setModalWindow(true);
    };

    /*
     * Effect Hook to fetch the user's photo URL from Firebase
     * and update the state accordingly.
    */
    useEffect(() => {
        const fetchUserPhotoURL = async () => {
            try {
                const url = await fetchPhotoURL(photoURL);
                setPhoto(url);
            } catch (error) {
                console.error("Error fetching photo:", error);
            }
        };

        fetchUserPhotoURL();
    });

    
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
                src={photo || default_avatar} 
                className="avatar_profile" 
                alt="avatar profile" 
            />

            <h2 className="user-name">
                {displayName}
            </h2>
        </div>
    );
};


export default Profile;