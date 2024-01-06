import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../../../firebase";


/**
 * CheckProfileUser component displays the selected user's profile information
 * and provides the option to add the user to contacts.
 *
 * @param {Object} selectedUser - The selected user's information.
 * @param {function} setIsModalOpen - Function to control the modal's visibility.
*/


const CheckProfileUser = ({ selectedUser, setIsModalOpen }) => {

    /**
     * Handles the process of adding a user to the contacts in the 'chats' collection.
    */


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
            const chatsDocRef = doc(db, 'own-chats', own_uid);

            // Document data to be updated or added to the 'chats' collection.
            const docChat = {
                [select_user_uid]: select_user_uid,
            };

            // Update the document in the 'chats' collection, merging existing data if the document already exists.
            await setDoc(chatsDocRef, docChat, { merge: true });
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

                    <button onClick={() => handleAddUser(selectedUser.uid, selectedUser.name)}>
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