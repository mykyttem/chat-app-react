import React, { useState } from "react";
import { useParams } from "react-router-dom";

// firebase
import { doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

// animation
import { Animated_chat } from "./animation";

// components
import PanelChat from "./panel_chat";
import MessageList from "./ListMessages";
import Input from "./InputField";


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
    const chatsDoc = chatId ? doc(db, "chats", chatId) : null;
    const [messages, setMessages] = useState([]);

    
    return (
        <>
            {chatId ? ( 
                <>
                    <Animated_chat>
                        <PanelChat />

                        <div className="chat">
                            <MessageList 
                                chatId={chatId}
                                chatsDoc={chatsDoc}
                                currentUser={currentUser}

                                messages={messages}
                                setMessages={setMessages}
                            />
    
                            <Input
                                currentUser={currentUser}
                                chatsDoc={chatsDoc}
                                setMessages={setMessages}
                            />
                        </div>
                    </Animated_chat>
                </>
            ) : (
                <div className="chat">
                    <h2 className="select-chat">Select chat or find user</h2>
                </div>
            )}
        </>
    );
};


export default Chat;