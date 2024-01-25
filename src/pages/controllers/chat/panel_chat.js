import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";

// firebase
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

// animation
import { Animated_menu } from "./animation";

// icons
import computer_webcam_video from "../../../assets/icons/computer_webcam_video.svg";
import phone from "../../../assets/icons/phone.svg";
import menu_chat from "../../../assets/icons/menu_chat.svg";

import avatar_companion from "../../../assets/companion.png";


const PanelChat = ({ setSearchMessage }) => {
    const { state } = useLocation();
    const { user } = state || {};

    const { chatId } = useParams();

    // menu input search message
    const [isSearchMessage, setIsSearchMessage] = useState(false);

    // menu chat 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsSearchMessage(!setIsSearchMessage);
    };

    const handle_ClearHistory = () => {
        // Show confirmation dialog
        setShowConfirmationDialog(true);
    };

    // confirm
    const confirmClearHistory = async () => {
        try {
            const chatRef = doc(db, "chats", chatId);

            await updateDoc(chatRef, {
                messages: [],
        });

        // Close confirmation dialog after clearing history
        setShowConfirmationDialog(false);

        } catch (error) {
            console.error("Error clearing chat history:", error.message);
        }
    };

    const cancelClearHistory = () => {
        // Close confirmation dialog without clearing history
        setShowConfirmationDialog(false);
    };

    const menuSearchMessage = () => {
        setIsSearchMessage(true);
    };

    return (
        <div className="panelChat">
            <img src={user.photo || avatar_companion} className="companion" alt="companion" />
            <h2 className="name-companion">{user.name}</h2>

            <div className="icons">
                <img src={computer_webcam_video} className="icon-webcam-video" alt="computer webcam video" />
                <img src={phone} className="icon-phone" alt="phone" />
                <img src={menu_chat} className="icon-menu" alt="menu" onClick={toggleMenu} />

                    
                {isMenuOpen && (
                    <Animated_menu>
                            <div className="menu">
                                <p onClick={handle_ClearHistory}>Clear history</p>
                                <p onClick={menuSearchMessage}>Search message</p>
                            </div>

                            {isSearchMessage && (
                                <div className="menu">
                                    <input
                                        type="text"
                                        placeholder="Search messages"
                                        style={{ color: "black" }}
                                        onChange={(e) => setSearchMessage(e.target.value)}
                                    />
                                </div>
                            )}
                    </Animated_menu>
                )}

                {showConfirmationDialog && (
                    <div className="confirmation-dialog">
                        <p>Are you sure you want to clear the chat history?</p>
                        <button className="button button-confirm" onClick={confirmClearHistory}>
                            Confirm
                        </button>
                        <button className="button button-cancel" onClick={cancelClearHistory}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


export default PanelChat;