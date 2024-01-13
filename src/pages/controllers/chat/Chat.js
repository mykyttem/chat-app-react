import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

// firebase
import { onSnapshot, doc, updateDoc, arrayUnion, Timestamp, arrayRemove } from "firebase/firestore";
import { db } from "../../../firebase";

// animation
import { Animated_chat, Animated_message } from "./animation";


// icons
import send from "../../../assets/icons/send.svg";
import clip from "../../../assets/icons/clip.svg";
import img from "../../../assets/icons/img.svg";

// components
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
    const chatssDoc = doc(db, "chats", chatId)

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [img_send, setImg] = useState(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedMessage, setSelectedMessage] = useState(null);

    const messagesRef = useRef();


    useEffect(() => {
        if (chatId) {
            const unSub = onSnapshot(chatssDoc, (doc) => {
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

    // scroll last message
    useEffect(() => {
        const lastMessage = document.querySelector('.messages > div:last-child');

        if (lastMessage) {
            lastMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


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

                setText("");
            }
        }
    };

    const formatTimestamp = (timestamp) => {
        const dateObject = timestamp.toDate();
        return dateObject.toLocaleString(); 
    };
    
    // close the menu if the user clicks elsewhere
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMenuOpen && !e.target.closest('.menu')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    
    const handle_ContextMenu = (e, message) => {
        e.preventDefault();
        
        // click own message
        if (message.senderId === currentUser.uid) {
            const containerRect = messagesRef.current.getBoundingClientRect();
    
            setMenuPosition({
                top: e.clientY - containerRect.top,
                left: e.clientX - containerRect.left,
            });

            // set selected message id
            setSelectedMessage(message.id);
            
            // open
            setIsMenuOpen(true);
        }
    };
    
    const handle_deleteMessage = async () => {
        // Remove the selected message from the 'messages' array
        await updateDoc(chatssDoc, {
            messages: arrayRemove(messages.find(m => m.id === selectedMessage)),
        });

        // Clear the selectedMessage to reset for the next interaction
        setSelectedMessage(null);
        setIsMenuOpen(false); 
    };
    
    return (
        <>
            {chatId ? ( 
                <>
                    <Animated_chat>
                        <PanelChat />

                        <div className="chat">
                            <div className="messages" ref={messagesRef}>
                                {messages.slice().reverse().map((m) => (
                                    <Animated_message key={m.date}>
                                        <div
                                            className={
                                                m.senderId === currentUser.uid
                                                    ? "bubble-own-message"
                                                    : "bubble-companion-message"
                                                }
                                                onContextMenu={(e) => handle_ContextMenu(e, m)}
                                        >
                                            <h2
                                                className={
                                                    m.senderId === currentUser.uid
                                                        ? "text-own-message"
                                                        : "text-companion-message"
                                                }
                                            >
                                                {m.text}
                                            </h2>
                                            <h2
                                                style={{ fontSize: "15px", color: "gray" }}
                                                className={
                                                    m.senderId === currentUser.uid
                                                        ? "text-own-message"
                                                        : "text-companion-message"
                                                }
                                            >
                                                {formatTimestamp(m.date)}
                                            </h2>
                                        </div>
                                    </Animated_message>
                                ))}
                            </div>

                            {isMenuOpen && (
                                <div className="menu" 
                                    style={{ top: menuPosition.top, left: menuPosition.left }} 
                                >

                                    <p onClick={handle_deleteMessage}>Delete message</p>
                                </div>
                            )}
                
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