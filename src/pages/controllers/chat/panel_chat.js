import React from "react";
import { useParams } from "react-router-dom";

// icons svg
import computer_webcam_video from "../../../assets/icons/computer_webcam_video.svg";
import phone from "../../../assets/icons/phone.svg";
import settings from "../../../assets/icons/settings_panelChat.svg";

// avatar
import avatar_companion from "../../../assets/companion.png";


const PanelChat = () => {
    const { name } = useParams();


    return (
        <div className="panelChat">
            <img 
                src={avatar_companion} 
                className="companion" 
                alt="companion"
            />

            <h2 className="name-companion">
                {name}   
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