import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// firebase
import { query, where, getDocs, getDoc, doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../../../firebase/firebase";

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

                            // return
                            return { ...userData, lastMessage };
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
    

    // Render the list of chats
    return (
        <ul className="chats">  
            {chats.map((user, index) => (
                <li key={index} className="side-chat" onClick={() => handleSelect({ user })}>
                    <img
                        src={avatar_companion}
                        className="chat-companion-avatar"
                        alt="chat-companion-avatar"
                    />
                    <h2 className="chat-name-companion">{user.name}</h2>
                    <h2 className="chat-message">{user.lastMessage ? user.lastMessage.text : 'No messages yet'}</h2>
                    <div className="line"></div>
                </li>
            ))}
        </ul>
    );
};


export default Chats;