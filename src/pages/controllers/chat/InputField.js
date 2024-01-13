import React, { useState } from "react";
import { v4 as uuid } from "uuid";

// firebase
import { updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { storage } from "../../../firebase";

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
            try {
                // Upload the selected image
                const imageUrl = await uploadImage();
                
                // Create a new message object for the image
                const newMessage = {
                    id: uuid(),
                    imageUrl,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                };
        
                // Update state to include the new image message
                setMessages((prevMessages) => [newMessage, ...prevMessages]);
        
                // Update the 'messages' field in the chat document with the new image message
                await updateDoc(chatsDoc, {
                    messages: arrayUnion(newMessage),
                });
        
                // Clear the selected image file
                setImg(null);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        } else {
             // Create a new message object for text
            const newMessage = {
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
            };
            
            // Update state to include the new text message
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
    
            // Update the 'messages' field in the chat document with the new text message
            await updateDoc(chatsDoc, {
                messages: arrayUnion(newMessage),
            });
    
            // Clear the text input
            setText("");
        }
    };
  
    /**
     * Uploads the selected image file to Firebase Storage and returns the download URL.
     * @returns {Promise<string>} Download URL of the uploaded image.
    */

    const uploadImage = async () => {
        try {
            const storageRef = ref(storage, `images/${uuid()}`);
            await uploadBytes(storageRef, img_send);

            const downloadUrl = await getDownloadURL(storageRef);
            return downloadUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };
  
    /**
     * Handles the click event when the image icon is clicked, triggering the file input click.
    */
    const handleImageClick = () => {
        // Create a file input element
        const input = document.createElement('input');

        input.type = 'file';
        input.accept = 'image/*';

        // Set up an event listener for file selection
        input.onchange = (e) => {
            const file = e.target.files[0];
            setImg(file);
        };

        // Trigger the file input click
        input.click();
    };
  
    return (
        <div className="block-input">
            <input
                className="field-input"
                type="text"
                placeholder={img_send ? "Image selected" : "Type something..."}
                onChange={(e) => setText(e.target.value)}
                value={text}
            />
    
            <img
                src={clip}
                className="clip"
                alt="clip"
                onClick={() => handleImageClick()}
            />
    
            <img
                src={img}
                className="img"
                alt="img"
                onClick={() => handleImageClick()}
            />
    
            <div className="box-send" onClick={handleSend}>
                <img src={send} className="send" alt="send" />
            </div>
        </div>
    )
};

  
export default Input;