import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";


/**
 * CheckProfileUser component displays the selected user's profile information
 * and provides the option to add the user to contacts.
 *
 * @param {Object} selectedUser - The selected user's information.
 * @param {function} setIsModalOpen - Function to control the modal's visibility.
*/


const CheckProfileUser = ({ selectedUser, setIsModalOpen, currentUser }) => {
    /**
     * Handles the process of adding a user to the contacts in the 'chats' collection.
    */
    
    const OwnChats_collection = "own-chats";
    const own_uid = currentUser.uid;


    const handleAddUser = async (select_user_uid) => {
        try {
            // doc ref
            const currentUserDocRef = doc(db, OwnChats_collection, own_uid);
            const selectedUserDocRef = doc(db, OwnChats_collection, select_user_uid);
            
            // data 
            const currentUserData = { [select_user_uid]: select_user_uid };
            const selectedUserData = { [own_uid]: own_uid };
            
            // Save 
            await setDoc(currentUserDocRef, currentUserData, { merge: true });
            await setDoc(selectedUserDocRef, selectedUserData, { merge: true });

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating document: ", error.message);
        } 
    };

    // Render the user profile modal
    return (
        <div className="modal-overlay">
            <div className="user-profile-modal">
                <div>
                    <img src={selectedUser.photoURL} alt="User Avatar" />
                    <h2>{selectedUser.name}</h2>
                    <p>Email: {selectedUser.email}</p>
                    <p>Phone Number: {selectedUser?.phoneNumber}</p>

                    <button onClick={() => handleAddUser(selectedUser.uid)}>
                        Add in contacts
                    </button>


                    <button className="close-button" onClick={() => setIsModalOpen(false)}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


export default CheckProfileUser;