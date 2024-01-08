import React, { useState } from "react";

// Firebase
import { collection } from "firebase/firestore";
import { db } from "../../../firebase";

// Components
import Chats from "./Chats";
import SearchUsers from "./Search";
import SearchResultsUsers from "./SearchResults";
import CheckProfileUser from "./UserProfile";


/**
 * Sidebar component that includes user search, selected user display, 
 * user data modal, adding user, and chats.
*/


const SideBar = ({ currentUser }) => {
    // State for user search
    const [inputSearch, setInputSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // State for modal and selected user data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Firestore collection for users
    const usersCollection = collection(db, 'users');


    /**
     * Handles user search based on input and search field.
     * Fetches user data from Firebase Firestore.
    */


    // Display the main sidebar content
    return (
        <div className="sidebar">
          
            <SearchUsers
                inputSearch={inputSearch}
                setInputSearch={setInputSearch}
                setSearchResults={setSearchResults}
                setIsModalOpen={setIsModalOpen}
                setSelectedUser={setSelectedUser}
                usersCollection={usersCollection}
            />

            
            {isModalOpen && (
                <CheckProfileUser
                    setIsModalOpen={setIsModalOpen}
                    selectedUser={selectedUser}
                    usersCollection={usersCollection}
                    currentUser={currentUser}
                />
            )}

        
            {inputSearch ? (
                <SearchResultsUsers
                    searchResults={searchResults}
                    setIsModalOpen={setIsModalOpen}
                    setSelectedUser={setSelectedUser}
                />
            ) : (
                <Chats 
                    usersCollection={usersCollection} 
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};


export default SideBar;