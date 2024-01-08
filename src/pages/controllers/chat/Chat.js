import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

// firebase
import { onSnapshot, doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";

// animation
import Animated from "./animation";

// icons
import send from "../../../assets/icons/send.svg";
import clip from "../../../assets/icons/clip.svg";
import img from "../../../assets/icons/img.svg";

// component
import PanelChat from "./panel_chat";


/**
 * @function Chat
 * @description Represents a chat component with real-time message updates.
 * @param {Object} props - Component properties.
 * @param {Object} props.currentUser - Current user information.
*/


const Chat = ({ currentUser }) => {
    // Retrieve chatId from URL parameters
    const { chatId } = useParams();

    // State variables for managing messages, text input, and image attachment
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [img_send, setImg] = useState(null);


    useEffect(() => {
        if (chatId) {
            const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
                if (doc.exists()) {
                    // sort messages by date in descending order
                    const sortedMessages = doc.data().messages.sort((a, b) => b.date - a.date);
                    setMessages(sortedMessages);
                }
            });

            return () => {
                unSub();
            };
        }
    }, [chatId]);


    const handleSend = async () => {
        if (chatId) {
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
                await updateDoc(doc(db, "chats", chatId), {
                    messages: arrayUnion(newMessage),
                });
            }
        }
    };

    const formatTimestamp = (timestamp) => {
        const dateObject = timestamp.toDate();
        return dateObject.toLocaleString(); 
    };

    return (
        <>
            <PanelChat />

            <div className="chat">
                <div className="messages">
                        {messages.slice().reverse().map((m) => (
                            <Animated>
                                <div key={m.date} 
                                    className={m.senderId === currentUser.uid 
                                    ? "bubble-own-message" 
                                    : "bubble-companion-message"}
                                >
                                    <h2 className={m.senderId === currentUser.uid 
                                        ? "text-own-message" 
                                        : "text-companion-message"}>
                                            {m.text}
                                    </h2>
                                    <h2 style={{ fontSize: "15px", color: "gray" }} 
                                        className={m.senderId === currentUser.uid 
                                        ? "text-own-message" 
                                        : "text-companion-message"}
                                    >
                                        {formatTimestamp(m.date)}
                                    </h2>
                                </div>
                            </Animated>
                        ))}
                </div>

                <div className="block-input">
                    <input
                        className="field-input"
                        type="text"
                        placeholder="Type something..."
                        onChange={(e) => setText(e.target.value)}
                    />

                    <img src={clip} className="clip" alt="clip" />

                    <img src={img} className="img" alt="img" />

                    <div className="box-send" onClick={handleSend}>
                        <img src={send} className="send" alt="send" />
                    </div>
                </div>
            </div>
        </>
    );
};


export default Chat;