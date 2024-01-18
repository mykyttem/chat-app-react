import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// firebase
import { query, where, getDocs, getDoc, doc, setDoc, deleteField, updateDoc} from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../../../firebase/firebase";
import { fetchPhotoURL } from "../../../firebase/getPhoto";

// assets
import avatar_companion from "../../../assets/companion.png";


/**
 * Chats component displays a list of chats with user avatars, names, and sample messages.
 *
 * @param {Object} usersCollection - Reference to the Firestore collection containing user data.
*/


const Chats = ({ usersCollection, currentUser }) => {
    const navigate = useNavigate();

    // State to store the list of chats
    const [chats, setChats] = useState([]);

    // context menu selected chat right click 
    const chatRef = useRef();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedChat, setSelectedChat] = useState(null);

    /**
     * Fetches user data for the chats based on the authenticated user's UID.
    */

    const getChats = useCallback(async () => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userUid = user.uid;
                const userDocRef = doc(db, 'own-chats', userUid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const chatsUser = userDocSnapshot.data();
                    const uid_users = Object.values(chatsUser);

                    const chatsWithLastMessage = await Promise.all(
                        uid_users.map(async (uid) => {
                            const q = query(usersCollection, where('uid', '==', uid));
                            const querySnapshot = await getDocs(q);

                            // assuming one user per UID
                            const userData = querySnapshot.docs.map(doc => doc.data())[0]; 

                            // Fetch last message from the chat
                            const chatId = currentUser.uid > userData.uid
                                ? currentUser.uid + userData.uid
                                : userData.uid + currentUser.uid;

                            const chatDocRef = doc(db, 'chats', chatId);
                            const chatDocSnapshot = await getDoc(chatDocRef);
                            const messages = chatDocSnapshot.exists() ? chatDocSnapshot.data().messages : [];
                            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

                            // get photo
                            let photo;
                            const photoURL = userData.photo;

                            if (photoURL) {
                                photo = await fetchPhotoURL(photoURL);  
                            }

                            return { ...userData, lastMessage, photo };
                        })
                    );

                    setChats(chatsWithLastMessage);
                }
            }
        });

        return () => unsubscribe();
    }, [usersCollection, setChats, currentUser.uid]);


    // Fetch chats on component mount
    useEffect(() => {
        getChats();
    }, [getChats]);


    const handleSelect = async ({ user }) => {
        // check whether the group(chats in firestore) exists, if not create
        const combinedId = 
            currentUser.uid > user.uid 
            ? currentUser.uid + user.uid 
            : user.uid + currentUser.uid

        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if(!res.exists()) {
                // create chat in chats collection
                await setDoc(doc(db, "chats", combinedId), { messages: [] });
            }

            navigate(`/chat/${combinedId}/${user.name}`);
        } catch (error) {
            console.error(error);
        }
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

    const handle_ContextMenu = (e, selectedChat) => {
        e.preventDefault();
    
        // click chat
        const containerRect = chatRef.current.getBoundingClientRect();
    
        setMenuPosition({
            top: e.clientY - containerRect.top,
            left: e.clientX - containerRect.left,
        });
    
        // set selected chat
        setSelectedChat(selectedChat);
    
        // open
        setIsMenuOpen(true);
    };
    

    const handle_deleteChat = async () => {  
        const currentUserUid = currentUser.uid;
        const userDocRef = doc(db, 'own-chats', currentUserUid);

        // Remove the selected chat   
        await updateDoc(userDocRef, {
            [selectedChat]: deleteField(),
        });
      
        // Optionally, update the local state to reflect the changes
        setChats(chats => chats.filter(chat => chat.uid !== selectedChat));
        setIsMenuOpen(false); 
    };


    // Render the list of chats
    return (
        <>
            <ul className="chats" ref={chatRef}>  
                {chats.map((user, index) => (
                    <li key={index} 
                        className="side-chat" 
                        onClick={() => handleSelect({ user })} 
                        onContextMenu={(e) => handle_ContextMenu(e, user.uid)}
                    >
                        <img
                            src={user.photo || avatar_companion}
                            className="chat-companion-avatar"
                            alt="chat-companion-avatar"
                        />
                        <h2 className="chat-name-companion">{user.name}</h2>
                        <h2 className="chat-message">{user.lastMessage ? user.lastMessage.text : 'No messages yet'}</h2>
                        <div className="line"></div>
                    </li>
                ))}
            </ul>

            {isMenuOpen && (
                <div className="menu" style={{ top: menuPosition.top, left: menuPosition.left }}>
                    <p onClick={handle_deleteChat}>Delete chat</p>
                </div>
            )}
        </>
    );
};


export default Chats;