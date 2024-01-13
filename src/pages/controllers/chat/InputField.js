import React, { useState } from "react";
import { v4 as uuid } from "uuid";

// firebase
import { updateDoc, arrayUnion, Timestamp } from "firebase/firestore";

// icons
import send from "../../../assets/icons/send.svg";
import clip from "../../../assets/icons/clip.svg";
import img from "../../../assets/icons/img.svg";


/**
 * @description Represents the input field for sending messages in the chat.
 * @param {Object} props.currentUser - Current user information.
 * @param {Object} props.chatsDoc - Firestore document reference for the chat.
 * @param {function} props.setMessages - State setter function for updating messages.
*/


const Input = ({ currentUser, chatsDoc, setMessages }) => {
    const [text, setText] = useState("");
    const [img_send, setImg] = useState(null);


    const handleSend = async () => {
        if (img_send) {
            // TODO: handle send img
        } else {
            const newMessage = {
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
            };
            
            // Update state to include the new message
            setMessages((prevMessages) => [newMessage, ...prevMessages]);

            // Update the 'messages' field in the chat document with the new message
            await updateDoc(chatsDoc, {
                messages: arrayUnion(newMessage),
            });

            setText("");
        }
    };


    return (
        <div className="block-input">
            <input
                className="field-input"
                type="text"
                placeholder="Type something..."
                onChange={(e) => setText(e.target.value)}
                value={text}
            />

            <img src={clip} className="clip" alt="clip" />

            <img src={img} className="img" alt="img" />

            <div className="box-send" onClick={handleSend}>
                <img src={send} className="send" alt="send" />
            </div>
        </div>
    )
}


export default Input;