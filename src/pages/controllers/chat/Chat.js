import React from "react";

import send from "../../../assets/icons/send.svg";
import clip from "../../../assets/icons/clip.svg";
import img from "../../../assets/icons/img.svg";


const Chat = () => {
    return (
        <div className="chat">
            <div className="bubble-own-message">
                <h2 className="text-own-message">message</h2>
            </div>

            <div className="bubble-companion-message">
                <h2 className="text-companion-message">message</h2>
            </div>

            <div className="block-input">
                <input className="field-input" type="text" placeholder="Type something..." />

                <img
                    src={clip}
                    className="clip"
                    alt="clip"
                />

                <img
                    src={img}
                    className="img"
                    alt="img"
                />

                <div className="box-send">
                    <img
                        src={send}
                        className="send"
                        alt="send"
                    />
                </div>
            </div>
        </div>
    )
}


export default Chat;