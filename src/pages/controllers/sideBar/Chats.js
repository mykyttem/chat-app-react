import React, { useCallback, useEffect, useState } from "react";
import { query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../../../firebase";
import avatar_companion from "../../../assets/companion.png";


/**
 * Chats component displays a list of chats with user avatars, names, and sample messages.
 *
 * @param {Object} usersCollection - Reference to the Firestore collection containing user data.
*/


const Chats = ({ usersCollection }) => {
    // State to store the list of chats
    const [chats, setChats] = useState([]);

    /**
     * Fetches user data for the chats based on the authenticated user's UID.
    */

    const getChats = useCallback(async () => {

        // Get chats
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userUid = user.uid;

                // Get data users from the 'chats' collection
                const userDocRef = doc(db, 'chats', userUid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const chatsUser = userDocSnapshot.data();

                    // Extract all values from the chatsUser object
                    const uid_users = Object.values(chatsUser);

                    const users = await Promise.all(uid_users.map(async (uid) => {
                        // Query user data from the users collection
                        const q = query(usersCollection, where('uid', '==', uid));
                        const querySnapshot = await getDocs(q);
                        const users = querySnapshot.docs.map(doc => doc.data());

                        return users;
                    }));

                    setChats(users);
                }
            }
        });

        // Cleanup function to unsubscribe from the auth state changes when the component unmounts
        return () => unsubscribe();
    }, [usersCollection, setChats]);


    // Fetch chats on component mount
    useEffect(() => {
        getChats();
    }, [getChats]);


    // Render the list of chats
    return (
        <ul className="chats">
            {chats.flat().map((user, index) => (
                <li key={index} className="side-chat">
                    
                    <img
                        src={avatar_companion}
                        className="chat-companion-avatar"
                        alt="chat-companion-avatar"
                    />
       
                    <h2 className="chat-name-companion">{user.name}</h2>
                    <h2 className="chat-message">message</h2>
                
                    <div className="line"></div>
                </li>
            ))}
        </ul>
    );
};


export default Chats;