import React from "react";

// icons svg
import computer_webcam_video from "../../assets/icons/computer_webcam_video.svg";
import phone from "../../assets/icons/phone.svg";
import settings from "../../assets/icons/settings_panelChat.svg";

// avatar
import avatar_companion from "../../assets/companion.png";


const PanelChat = () => {
    return (
        <div className="panelChat">
            <img 
                src={avatar_companion} 
                className="companion" 
                alt="companion"
            />

            <h2 className="name-companion">
                Name    
            </h2>        

        
            <div className="icons">
                <img src={computer_webcam_video} 
                    className="icon-webcam-video" 
                    alt="computer webcam video" 
                />
                <img 
                    src={phone} 
                    className="icon-phone" 
                    alt="phone" 
                />
                <img 
                    src={settings} 
                    className="icon-settings" 
                    alt="settings" 
                />
            </div>
        </div>
    )
}


export default PanelChat