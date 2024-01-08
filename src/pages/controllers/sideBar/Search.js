import React, { useState, useCallback } from "react";
import { query, where, getDocs } from "firebase/firestore";
import search from "../../../assets/icons/search.svg";


/**
 * SearchUsers component allows users to search for other users based on name, email, or phone number.
 * It provides a search input field, a dropdown to select search criteria, and triggers a search based on user input.
 *
 * @component
 * @param {string} inputSearch - The user's input for the search query.
 * @param {function} setInputSearch - Function to update the search input state.
 * @param {function} setSearchResults - Function to update the search results state.
 * @param {Object} usersCollection - Reference to the Firestore collection containing user data.
*/


const SearchUsers = ({ inputSearch, setInputSearch, setSearchResults, usersCollection }) => {
    // State to track the selected search field (name, email, phoneNumber)
    const [searchField, setSearchField] = useState('name');
    const minInputLength = 1;

    /**
     * Handles the search process based on the selected search field and user input.
     *
     * @async
     * @param {string} searchInput - The user's input for the search query.
    */

    const handleSearch = useCallback(async (searchInput) => {
        try {
            let q;

            // Construct query based on the selected search field
            if (searchField === 'name') {
                q = query(usersCollection, where('name', '==', searchInput));
            } else if (searchField === 'email') {
                q = query(usersCollection, where('email', '==', searchInput));
            } else if (searchField === 'phoneNumber') {
                q = query(usersCollection, where('phoneNumber', '==', searchInput));
            }

            // Execute the query and update search results
            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map(doc => doc.data());

            setSearchResults(results);
        } catch (error) {
            // Reset search results and log an error message
            setSearchResults([]);
            console.error('Error fetching user data:', error.message);
        }
    }, [searchField, setSearchResults, usersCollection]);


    const handleInputChange = (e) => {
        const newInputSearch = e.target.value;
        setInputSearch(newInputSearch);

        // Call handleSearch only if enough characters are entered
        if (newInputSearch.length >= minInputLength) {
            handleSearch(newInputSearch);
        } else {
            setSearchResults([]);
        }
    };


    const handleSelectChange = (e) => {
        const newSearchField = e.target.value;
        setSearchField(newSearchField);
    };


    return (
        <div className="block-search">
            <div className="field-search-user">
                <img 
                    src={search} 
                    className="search" 
                    alt="search"
                />

                <input 
                    className="text-field" 
                    placeholder="Find a user..."
                    type="text" 
                    value={inputSearch}
                    onChange={handleInputChange}
                />
            </div>

            <select
                value={searchField}
                className="select-field"
                onChange={handleSelectChange}
            >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="phoneNumber">Phone Number</option>
            </select>
        </div>
    );
};


export default SearchUsers;