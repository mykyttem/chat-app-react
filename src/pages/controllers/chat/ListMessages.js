import React, { useEffect, useState, useRef } from "react";

// firebase
import { onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";

// animation
import { AnimatedMessage } from "./animation";


/**
 * @description Displays a list of messages in the chat.
 * @param {string} props.chatId - ID of the current chat.
 * @param {Object} props.chatsDoc - Firestore document reference for the chat.
 * @param {Object} props.currentUser - Current user information.
 * @param {Array} props.messages - Array of messages in the chat.
 * @param {function} props.setMessages - State setter function for updating messages.
*/


const MessageList = ({ chatId, chatsDoc, currentUser, messages, setMessages }) => {

    const [selectedMessage, setSelectedMessage] = useState(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const messagesRef = useRef();


    useEffect(() => {
        if (chatId) {
            const unSub = onSnapshot(chatsDoc, (doc) => {
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
    }, [chatId, chatsDoc, setMessages]);

    // scroll last message
    useEffect(() => {
        const lastMessage = document.querySelector('.messages > div:last-child');

        if (lastMessage) {
            lastMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


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
        await updateDoc(chatsDoc, {
            messages: arrayRemove(messages.find(m => m.id === selectedMessage)),
        });

        // Clear the selectedMessage to reset for the next interaction
        setSelectedMessage(null);
        setIsMenuOpen(false); 
    };

    const formatTimestamp = (timestamp) => {
        const dateObject = timestamp.toDate();
        return dateObject.toLocaleString(); 
    };


    return (
        <>
            <div className="messages" ref={messagesRef}>
                {messages.slice().reverse().map((m) => (
                    <AnimatedMessage key={m.date}>
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
                    </AnimatedMessage>
                ))}
            </div>

            {isMenuOpen && (
                <div className="menu" 
                    style={{ top: menuPosition.top, left: menuPosition.left }} 
                >

                    <p onClick={handle_deleteMessage}>Delete message</p>
                </div>
            )}
        </>
    )
}


export default MessageList;