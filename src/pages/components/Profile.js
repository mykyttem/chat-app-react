import React, { useState } from "react";

import default_avatar from "../../assets/defaultAvatar_profile.png";
import profile_settings from "../../assets/icons/profile_settings.svg";


const Profile = ({ name, email }) => {

    /**
     * Button settings - open modal window
     * In modal window:
     *      state_DataUser - for change data in modal window
     *      handleImageChange - show photo, and name image
    */

    // values for change new data user
    const [state_DataUser, setState_DataUser] = useState({
        newName: name,
        newEmail: email,
        newPassword: ''
    });

    // modal window for settings 
    const [showModalWindow, setModalWindow] = useState(false);
    const [stateImage, setImage] = useState({
        loadedImage: false,
        imageSrc: '',
        nameImage: ''
    });

    const openModal_Settings = () => {
        setModalWindow(true);
    };

    const cancel_CloseModal = () => {
        setModalWindow(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setImage((prevState) => ({
              ...prevState,
              loadedImage: true,
              imageSrc: reader.result,
              nameImage: file.name
            }));
          };
          reader.readAsDataURL(file);
        }
      };    
    

    return (
        <div className="profile">
            <button
                onClick={openModal_Settings}
                className="button_profile_settings"
                aria-label="Button for Profile Settings"
            >
                <img 
                    src={profile_settings} 
                    className="button_profile_settings_icon"
                    alt="button_profile_settings"
                />
            </button> 

            {showModalWindow && (
                <div className="modal-overlay">
                    <div className="modal">

                        <h2 className="title-name">Name</h2>
                        <div className="change-name">
                            <input 
                                className="type-change-name" 
                                placeholder="Type your name..."
                                type="text"
                                value={state_DataUser.newName}
                                onChange={(e) => setState_DataUser({ ...state_DataUser, newName: e.target.value })}
                            />
                        </div>

                        <h2 className="title-email">Email</h2>
                        <div className="change-email">
                            <input 
                                className="type-change-email" 
                                placeholder="Type your email..."
                                type="email"
                                value={state_DataUser.newEmail}
                                onChange={(e) => setState_DataUser({ ...state_DataUser, newEmail: e.target.value })}
                            />
                        </div>

                        <h2 className="title-password">Password</h2>
                        <div className="change-password">
                            <input 
                                className="type-change-password" 
                                placeholder="Type your password..."
                                type="password"
                                value={state_DataUser.newPassword}
                                onChange={(e) => setState_DataUser({ ...state_DataUser, newPassword: e.target.value })}
                            />
                        </div>

                        {stateImage.loadedImage ? (
                            <img
                                src={stateImage.imageSrc}
                                className="current-photo"
                                alt="current avatar"
                            />
                            ) : (
                            <img 
                                src={default_avatar} 
                                className="current-photo" 
                                alt="default avatar" 
                            />
                        )}
                        <div className="change-photo">
                        <h2 className="text-upload">
                            {stateImage.nameImage ? `${stateImage.nameImage}` : 'Upload'}
                        </h2>
                            <input
                                className="upload-file"
                                type="file"
                                onChange={handleImageChange}
                            />
                        </div>

                        <button className="button-cancel" onClick={cancel_CloseModal}>Cancel</button>
                        <button className="button-save">Save</button>
                    </div>
                </div>
            )}
        

            <img 
                src={default_avatar} 
                className="avatar_profile" 
                alt="avatar profile" 
            />

            <h2 className="user-name">
                {name}
            </h2>
        </div>
    )
}


export default Profile; 