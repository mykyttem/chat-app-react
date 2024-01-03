import avatar_companion from "../../../assets/companion.png";

/**
 * SearchResultsUsers component displays a list of search results with user avatars and names.
 * Clicking on a user opens their profile in a modal.
 *
 * @param {Array} searchResults - An array of user objects representing search results.
 * @param {function} setIsModalOpen - Function to control the modal's visibility.
 * @param {function} setSelectedUser - Function to set the selected user for the profile modal.
*/


const SearchResultsUsers = ({ searchResults, setIsModalOpen, setSelectedUser }) => {

    /**
     * Handles opening the user profile modal when a user is clicked.
     *
     * @param {Object} selectedUser - The selected user for whom the profile is displayed.
    */


    const handleCheck_SelectedUserProfile = async (selectedUser) => {
        try {
            setSelectedUser(selectedUser);

            // Open the modal
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };


    // Render the search results
    return (
        <div className="result-search">
            {searchResults.map((user) => (
                <div key={user.id} className="user" onClick={() => handleCheck_SelectedUserProfile(user)}>
                    
                    <img
                        src={avatar_companion}
                        className="result-user-avatar"
                        alt={`result user avatar for ${user.name}`}
                    />

                    
                    <h2 className="result-user-name">
                        {user.name}
                    </h2>
                </div>
            ))}
        </div>
    );
};


export default SearchResultsUsers;