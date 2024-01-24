import React, { useEffect, useState, useRef } from "react";

// firebase
import { onSnapshot } from "firebase/firestore";

// animation
import { AnimatedMessage } from "./animation";

// styles
import "../../styles/chat/contextMenu.scss";
import "../../styles/chat/chat.scss";

// components
import InteractionMessage from "./interactionWithMessage";


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
    // messages
    const [isNewMessage, setIsNewMessage] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
    const messagesRef = useRef();

    // menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const [selectedMessage, setSelectedMessage] = useState(null);
    

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

    // menu
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

    // formating time message
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
                <InteractionMessage 
                    currentUser={currentUser}
                    chatsDoc={chatsDoc}
                    messages={messages}

                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    menuPosition={menuPosition}

                    messagesRef={messagesRef}

                    forwardMessage={forwardMessage}

                    selectedMessage={selectedMessage}
                    setSelectedMessage={setSelectedMessage}
                />
            )}
        </>
    )
}


export default MessageList;