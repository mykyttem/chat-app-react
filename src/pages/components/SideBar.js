import React from "react";

// svg
import search from "../../assets/icons/search.svg";
import pin from "../../assets/icons/pin.svg";

// avatar
import avatar_companion from "../../assets/companion.png"


const SideBar = () => {
    return (
        <div className="sidebar">
            <div className="field-search-user">
                <img 
                    src={search} 
                    className="search" 
                    alt="search"
                />

                <input type="text" className="text-field" placeholder="Find a user..."/>
            </div>

            <div className="chats">
                <div className="side-chat">
                    <img 
                        src={pin} 
                        className="pin" 
                        alt="pin"
                    />

                    <img 
                        src={avatar_companion} 
                        className="chat-companion-avatar" 
                        alt="chat-companion-avatar"
                    />

                    <h2 className="chat-name-companion">
                        Name
                    </h2>

                    <h2 className="chat-message">
                        message
                    </h2>

                    <div className="line"></div>
                </div>

                <div className="side-chat">
                    <img 
                        src={avatar_companion} 
                        className="chat-companion-avatar" 
                        alt="chat-companion-avatar"
                    />

                    <h2 className="chat-name-companion">
                        Name 2
                    </h2>

                    <h2 className="chat-message">
                        message 2
                    </h2>

                    <div className="line"></div>
                </div>
            </div>
        </div>
    )
} 


export default SideBar;