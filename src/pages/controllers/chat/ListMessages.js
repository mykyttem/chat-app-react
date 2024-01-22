import React, { useEffect, useState, useRef } from "react";

// firebase
import { onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";

// animation
import { AnimatedMessage } from "./animation";

// styles
import "../../styles/chat/contextMenu.scss";
import "../../styles/chat/chat.scss";


/**
 * @description Displays a list of messages in the chat.
 * @param {string} props.chatId - ID of the current chat.
 * @param {Object} props.chatsDoc - Firestore document reference for the chat.
 * @param {Object} props.currentUser - Current user information.
 * @param {Array} props.messages - Array of messages in the chat.
 * @param {function} props.setMessages - State setter function for updating messages.
 * Interaction with the message
*/


const MessageList = ({ chatId, chatsDoc, currentUser, messages, setMessages, forwardMessage }) => {

    // interaction with the message
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [editMessage, setEditMessage] = useState('');
    const [isEditMessage, setIsEditMessage] = useState(false);

    // menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    // messages
    const [isNewMessage, setIsNewMessage] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
    const messagesRef = useRef();
    

    useEffect(() => {
        const unSub = onSnapshot(chatsDoc, (doc) => {
            if (doc.exists()) {
                // sort messages by date in descending order
                const sortedMessages = doc.data().messages.sort((a, b) => b.date - a.date);
                setMessages(sortedMessages);

                if (isScrolledToBottom) {
                    setIsNewMessage(true);
                }
            }
        });

        return () => {
            unSub();
        };
    }, [chatId, setMessages, isScrolledToBottom]);

    // scroll last message
    useEffect(() => {
        const lastMessage = document.querySelector('.messages > div:last-child');

        if (lastMessage && isNewMessage) {
            lastMessage.scrollIntoView({ behavior: 'smooth' });
            setIsNewMessage(false);
        }
    }, [messages, isNewMessage]);

    const handleScroll = () => {
        const messagesContainer = messagesRef.current;
        const isBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop === messagesContainer.clientHeight;
        
        setIsScrolledToBottom(isBottom);
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
        
        const containerRect = messagesRef.current.getBoundingClientRect();

        setMenuPosition({
            top: e.clientY - containerRect.top,
            left: e.clientX - containerRect.left,
        });

        setSelectedMessage(message);

        // open
        setIsMenuOpen(true);
    };
    

    const handle_deleteMessage = async () => {  
        // Remove the selected message from the 'messages' array
        await updateDoc(chatsDoc, {
            messages: arrayRemove(messages.find(m => m.id === selectedMessage.id)),
        });

        // Clear the selectedMessage to reset for the next interaction
        setSelectedMessage(null);
        setIsMenuOpen(false); 
    };


    const handleEditMessage = () => {
        setEditMessage(messages.find(m => m.id === selectedMessage.id)?.text || '');
        setIsEditMessage(true);
    };

    const handleSaveEdit = async () => {
        const editedMessages = messages.map(message =>
            message.id === selectedMessage.id ? { ...message, text: editMessage } : message
        );
    
        await updateDoc(chatsDoc, {
          messages: editedMessages,
        });
    
        setSelectedMessage(null);
        setEditMessage('');
        setIsEditMessage(false);
        setIsMenuOpen(false);
    };

    const forward_message = async () => {
        forwardMessage(selectedMessage.text);
        setIsMenuOpen(false);
    };

    const copy_message = () => {
        navigator.clipboard.writeText(selectedMessage.text);
        setIsMenuOpen(false);
    };

    const formatTimestamp = (timestamp) => {
        const dateObject = timestamp.toDate();
        return dateObject.toLocaleString(); 
    };


    return (
        <>
            <div className="messages" ref={messagesRef} onScroll={handleScroll}>
                {messages.slice().reverse().map((m) => (
                    <AnimatedMessage key={m.date}>
                        <div className={ m.senderId === currentUser.uid
                            ? "bubble-own-message"
                            : "bubble-companion-message"
                        }
                        onContextMenu={(e) => handle_ContextMenu(e, m)}
                        >

                            {m.imageUrl ? (
                                <img src={m.imageUrl} alt="messageImage" style={{width: 250}}/>
                            ) : (
                                <>
                                    {m.forward && (
                                        <>
                                            <div className="div-forward">
                                                <h2 className="text-forward">{m.forward}</h2>
                                            </div>
                                            <div className="line"></div>
                                        </>
                                    )}


                                    <h2 className={ m.senderId === currentUser.uid
                                            ? "text-own-message"
                                            : "text-companion-message"
                                        }
                                    >
                                            {m.text}
                                    </h2>
                                    <h2 className={ m.senderId === currentUser.uid
                                            ? "text-own-message"
                                            : "text-companion-message"
                                        }
                                            style={{ fontSize: "15px", color: "gray" }}
                                        >
                                            {formatTimestamp(m.date)}
                                    </h2>
                                </>
                            )}
                        </div>
                    </AnimatedMessage>
                ))}
            </div>

            {isMenuOpen && (
                <>
                    <div className="menu" style={{ top: menuPosition.top, left: menuPosition.left }}>
                        {selectedMessage.senderId === currentUser.uid ? (
                            <>
                                <p onClick={handle_deleteMessage}>Delete message</p>
                                <p onClick={handleEditMessage}>Edit</p>
                                <p onClick={forward_message}>Forward</p>
                                <p onClick={copy_message}>Copy</p>
                            </>
                        ) : (
                            <>
                                <p onClick={forward_message}>Forward</p>
                                <p onClick={copy_message}>Copy</p>
                            </>
                        )}
                    </div>

                    {isEditMessage && (
                        <div className="menu" style={{ top: menuPosition.top, left: menuPosition.left }}>
                            <input
                                className="edit-input"
                                type="text"
                                value={editMessage}
                                onChange={(e) => setEditMessage(e.target.value)}
                            />
                            <button className="edit-button" onClick={handleSaveEdit}>Save</button>
                        </div>
                    )}
                </>
            )}
        </>
    )
}


export default MessageList;