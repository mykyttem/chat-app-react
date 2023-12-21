import React from "react";


const Chat = () => {
    return (
        <div className="chat">
            <div className="bubble-own-message">
                <h2 className="text-own-message">message</h2>
            </div>

            <div className="bubble-companion-message">
                <h2 className="text-companion-message">message</h2>
            </div>
        </div>
    )
}


export default Chat;