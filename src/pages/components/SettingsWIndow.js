import React, { useState } from "react";

import "../styles/settings.scss";

// firebase 
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut, updatePhoneNumber } from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import { storage, auth } from "../../firebase";

// files
import default_avatar from "../../assets/defaultAvatar_profile.png";
import logout from "../../assets/icons/logout.svg";

const Settings = ({ user, setModalWindow }) => {
    /**
     *  state_DataUser - for change data in modal window
     *  handleImageChange - show photo, and name image 
     *  update profile - name, photoURL
     *  update password - if current correct
    */

    // current data user
    const { displayName, email, phoneNumber, uid } = user;
    

    // values for new data user
    const [state_DataUser, setState_DataUser] = useState({
        newName: displayName,
        newEmail: email,
        currentPassword: '',
        newPassword: '',
        newPhoneNumber: '',
        alert: ''
    });

    // values for new photo
    const [stateImage, setImage] = useState({
        loadedImage: false,
        imageSrc: '',
        nameImage: ''
    });

    // button cancel for close window
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

    // apply and update data user
    const apply = () => {
        const { newName, currentPassword, newPassword, newPhoneNumber, alert } = state_DataUser;
        const { imageSrc, nameImage } = stateImage;
        

        // update password
        if (currentPassword && newPassword) {
            const credential = EmailAuthProvider.credential(email, currentPassword);

            reauthenticateWithCredential(user, credential)
                .then(() => {
                    updatePassword(user, newPassword)
                        .then(() => {
                            setState_DataUser({ ...state_DataUser, alert: 'Succesful! Password updated!' });
                        })
                        .catch((e) => {
                            setState_DataUser({ ...state_DataUser, alert: `Error! Password could not be updated!` });
                            console.error(`Error updating password: ${alert}`);
                        });
                })
                .catch((reauthError) => {
                    setState_DataUser({ ...state_DataUser, alert: 'Error! Current password is incorrect!' })
                    console.error(`Error reauthenticating user: ${reauthError}`);                    
                });
        }

        
        /* * Upload new photo: 
         *      function convert base64 to Blob object
         *      create blob object
         *      uploadbytes - save to storage
         *      alert - if succesful uploaded photo, else alert not uploaded
        */

       if (imageSrc) {
            // Convert base64 data URL to Blob
            const dataURLtoBlob = (dataURL) => {
                const arr = dataURL.split(",");
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
    
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
    
                return new Blob([u8arr], { type: mime });
            };
        
    
            const blob = dataURLtoBlob(imageSrc);
            const imageURL = `profile_photo/${uid}/${nameImage}`;
            const storageRef = ref(storage, imageURL);
    
            // Upload Blob to Firebase Storage
            uploadBytes(storageRef, blob)
                .then(() => {
                    // update imageURL
                    updateProfile(user, { "photoURL": imageURL })
                        .then(() => {
                            setState_DataUser({ ...state_DataUser, alert: 'Succesful! New photo Updated' });
                        }) 
                        .catch((error) => {
                            console.error(error);   
                        });
                })
                
                .catch((error) => {
                    setState_DataUser({ ...state_DataUser, alert: 'Error! New photo could not be uploaded!' })
                    console.error(`Error upload photo: ${error}`);
                });
        }

        // update new name
        if (state_DataUser.displayName !== newName) {
            updateProfile(user, {"displayName": newName})
                .then(() => {
                    setState_DataUser({ ...state_DataUser, alert: 'Succesful! New Name updated' });
                }) 
                .catch((error) => {
                    console.error(error);   
                });
        }

        if (state_DataUser.phoneNumber !== newPhoneNumber) {
            updatePhoneNumber(user, {"phoneNumber": phoneNumber})
                .then(() => {
                    setState_DataUser({ ...state_DataUser, alert: 'Succesful! New phone number updated' });
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }   
    
    // button logout
    const handleLogout = () => {
        signOut(auth) 
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                setState_DataUser({ ...state_DataUser, alert: 'Fail! could not log out' })
                console.error(error);
            });
    }


    return (
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

                <h2 className="title-current-password">Current password</h2>
                <div className="current-password">
                    <input 
                        className="type-current-password" 
                        placeholder="Type your current password..."
                        type="password"
                        value={state_DataUser.currentPassword}
                        onChange={(e) => setState_DataUser({ ...state_DataUser, currentPassword: e.target.value })}
                    />
                </div>

                <h2 className="title-password">Password</h2>
                <div className="change-password">
                    <input 
                        className="type-change-password" 
                        placeholder="Type your new password..."
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

                {state_DataUser.alert && <h2 className="text-handler-photo">{state_DataUser.alert}</h2>}

                <button
                    className="button_profile_logout" 
                    aria-label="Button for Profile logout"
                    onClick={handleLogout}
                >

                    <img 
                        src={logout} 
                        className="button_profile_logout_icon"
                        alt="button_profile_logout"
                    />
                </button>

                <button className="button-cancel" onClick={cancel_CloseModal}>Cancel</button>
                <button className="button-save" onClick={apply}>Apply</button>
            </div>
        </div>
    )
}


export default Settings;