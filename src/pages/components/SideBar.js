import React, { useEffect, useState } from "react";

// firebase
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../../firebase";

// svg
import search from "../../assets/icons/search.svg";
import pin from "../../assets/icons/pin.svg";

// avatar
import avatar_companion from "../../assets/companion.png"


/**
 * User search 
 * Selected user from resutls searching
 * Display data user in modal window
 * Add user
 * Chats
*/


const SideBar = () => {
    // search user
    const [inputSearch, setInputSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchField, setSearchField] = useState('name');

    // modal, data profile selected user
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedUser, setSelectedUser] = useState(null);


    /**
     * Handles user search based on input and search field.
     * Fetches user data from Firebase Firestore.
    */

    // db users
    const usersCollection = collection(db, 'users'); 

    // handle search
    const handleSearch = async () => {
        try {
            let q;
    
            if (searchField === 'name') {
                q = query(usersCollection, where('name', '==', inputSearch));
            } else if (searchField === 'email') {
                q = query(usersCollection, where('email', '==', inputSearch));
            } else if (searchField === 'phoneNumber') {
                q = query(usersCollection, where('phoneNumber', '==', inputSearch));
            }
    
            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map(doc => doc.data());
    
            setSearchResults(results);
        } catch (error) {
            setSearchResults([]);
            console.error('Error fetching user data:', error.message);
        }
    };
    
    // Effect to trigger search when input or search field changes
    useEffect(() => {
        if (inputSearch) {
            handleSearch();
        }
    }, [inputSearch, searchField]);


    /**
     * Handles the process of adding a user to a chat in Firebase Firestore.
     * This function assumes Firebase authentication is set up and available.
     * @param {string} select_user_uid - The UID of the user to be added to the chat.
     * @param {string} name - The name or identifier of the user to be added to the chat.
     * @throws {Error} Throws an error if the user is not authenticated during the process.
    */

    // add user in DB 
    const handleAddUser = async (select_user_uid, name) => {
        try {
            // Wait for the user to be authenticated using onAuthStateChanged.
            const user = await new Promise((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                if (user) {
                    resolve(user);
                } else {
                    reject(new Error("User not authenticated"));
                }
                });
            });
        
            // Obtain the UID of the currently authenticated user.
            const own_uid = user.uid;
        
            // Reference to the document in the 'chats' collection with the UID of the currently authenticated user.
            const chatsDocRef = doc(db, 'chats', own_uid);
        
            // Document data to be updated or added to the 'chats' collection.
            const docChat = {
                [`companion_${name}`]: select_user_uid,
            };
        
            // Update the document in the 'chats' collection, merging existing data if the document already exists.
            await setDoc(chatsDocRef, docChat, { merge: true });
        } catch (error) {
            // Log an error message if there is an issue during the process.
            console.error("Error updating document: ", error.message);
        }
    };


    // in modal window display data user
    const handleCheck_SelectedUserProfile = async (selectedUser) => {
        try {
            // Fetch user data from the database based on the UID
            const q = query(usersCollection, where('uid', '==', selectedUser.uid));
            const querySnapshot = await getDocs(q);
        
            // Extract user data from the query snapshot
            const userData = querySnapshot.docs.map(doc => doc.data());
            setSelectedUser(userData);

            // Open the modal
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };
      

    return (
        <div className="sidebar">
            <div className="block-search">
                <div className="field-search-user">
                    <img 
                        src={search} 
                        className="search" 
                        alt="search"
                    />
                    <input 
                        type="text" 
                        className="text-field" 
                        value={inputSearch}
                        onChange={(e) => setInputSearch(e.target.value)}
                        placeholder="Find a user..."
                    />
                </div>
                <select
                    value={searchField}
                    className="select-field"
                    onChange={(e) => setSearchField(e.target.value)}
                >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="phoneNumber">Phone Number</option>
                </select>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="user-profile-modal">
                        {selectedUser.map(user => (
                            <div>
                                <img src={user.photoURL} alt="User Avatar" />
                                <h2>{user.name}</h2>
                                <p>Email: {user.email}</p>
                                <p>Phone Number: {user.phoneNumber}</p>

                                <button onClick={() => handleAddUser(user.uid, user.name)}>
                                    Add in contacts 
                                </button>

                                <button className="close-button" onClick={() => setIsModalOpen(false)}>
                                    Close
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
    
            {inputSearch ? (
                <div className="result-search">
                    {searchResults.map((user) => (
                        <div key={user.id} className="user" onClick={() => handleCheck_SelectedUserProfile(user)}>  
                            <img 
                                src={avatar_companion} 
                                className="result-user-avatar" 
                                alt="result user avatar"
                            />

                            <h2 className="result-user-name">
                                {user.name}
                            </h2>
                        </div>
                    ))}
                </div>

            // if user not type find user, display chats 
            ) : (
                <div className="chats">
                    <div className="side-chat">
                        <img 
                            src={pin} 
                            className="pin" 
                            alt="pin"
                        />

                        <img 
                            src={avatar_companion} 
                            className="chat-companion-avatar" 
                            alt="chat-companion-avatar"
                        />

                        <h2 className="chat-name-companion">
                            Name
                        </h2>

                        <h2 className="chat-message">
                            message
                        </h2>

                        <div className="line"></div>
                    </div>

                    <div className="side-chat">
                        <img 
                            src={avatar_companion} 
                            className="chat-companion-avatar" 
                            alt="chat-companion-avatar"
                        />

                        <h2 className="chat-name-companion">
                            Name 2
                        </h2>

                        <h2 className="chat-message">
                            message 2
                        </h2>

                        <div className="line"></div>
                    </div>
                </div>
            )}
        </div>
    )
} 
 

export default SideBar;