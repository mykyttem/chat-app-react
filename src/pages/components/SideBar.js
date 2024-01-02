import React, { useEffect, useState } from "react";

// firebase
import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "../../firebase";

// svg
import search from "../../assets/icons/search.svg";
import pin from "../../assets/icons/pin.svg";

// avatar
import avatar_companion from "../../assets/companion.png"


/**
 * SideBar component for user search and displaying chat information.
*/


const SideBar = () => {
    // search user
    const [inputSearch, setInputSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchField, setSearchField] = useState('name'); 

    /**
     * Handles user search based on input and search field.
     * Fetches user data from Firebase Firestore.
    */

    // handle search
    const handleSearch = async () => {
        try {
            const usersCollection = collection(db, 'users');
            let q;
    
            if (searchField === 'name') {
                q = query(usersCollection, where('name', '==', inputSearch));
            } else if (searchField === 'email') {
                q = query(usersCollection, where('email', '==', inputSearch));
            } else if (searchField === 'phoneNumber') {
                q = query(usersCollection, where('phoneNumber', '==', inputSearch));
            }
    
            const querySnapshot = await getDocs(q);
            const results = [];
    
            querySnapshot.forEach((doc) => {
                results.push(doc.data());
            });
    
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

    
    // Rendered component
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

    
            {inputSearch ? (
                <div className="result-search">
                    {searchResults.map((user) => (
                        <div key={user.id} className="user">  
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