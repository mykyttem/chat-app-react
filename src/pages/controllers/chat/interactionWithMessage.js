import React, { useEffect, useState } from "react";

// firebase
import { updateDoc, arrayRemove } from "firebase/firestore";


const InteractionMessage = ({ currentUser, chatsDoc, messages, isMenuOpen, setIsMenuOpen, menuPosition, forwardMessage, selectedMessage, setSelectedMessage }) => {
    // interaction with the message
    const [editMessage, setEditMessage] = useState('');
    const [isEditMessage, setIsEditMessage] = useState(false);

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


    // handlers
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


    return (
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
    )
}


export default InteractionMessage;