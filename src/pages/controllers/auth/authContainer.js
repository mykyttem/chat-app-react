// Import necessary dependencies and modules
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";

import { auth, db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";



/**
 * Manages user authentication logic for sign-up and sign-in.
 * Uses Firebase authentication functions for user creation, profile update, and sign-in.
 * Handles form validation and error handling.
 * 
 * @param {Object} props - Component properties.
 * @param {Function} props.children - Render prop function for rendering child components.
 * @param {boolean} props.isSignUp - Flag indicating whether it is a sign-up process.
 * @param {Function} props.navigate - Function for navigation using the `useNavigate` hook.
 * @returns {*} - Rendered component based on the provided children render prop.
*/


const AuthContainer = ({ children, isSignUp, navigate }) => {
    // State to manage user input and errors
    const [state, setState] = useState({
        displayName: "",
        email: "",
        password: "",
        error: "",
        alert: ""
    });


    const submit = async (e) => {
        e.preventDefault();

        // Destructure user input from state
        const { displayName, email, password } = state;

        // Check the format of the user input data
        if (password.length < 6) {
            setState({ ...state, error: 'Password must be at least 6 characters long' });
            return;
        }

        if (/^\d/.test(password)) {
            setState({ ...state, error: 'Password should not start with a number' });
            return;
        }

        // Validate email format
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        if (!isValidEmail(email)) {
            setState({ ...state, error: 'Invalid email format' });
            return;
        }

        try {
            if (isSignUp) {
                // Sign up new user
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;

                        // Update user profile with display name
                        updateProfile(user, { displayName: displayName })
                            .then(() => {
                                // save in DB
                                const userDocRef = doc(db, "users", user.uid);
                                
                                const dataUser = {
                                    name: user.displayName,
                                    email: user.email,
                                    phoneNumber: user.phoneNumber,
                                    photo: user.photoURL,
                                    uid: user.uid
                                }

                                setDoc(userDocRef, dataUser, { merge: true })

                                // Navigate to sign-in after successful sign-up
                                navigate("/sign-in");
                            })
                            .catch((error) => {
                                console.log("Error updating profile", error);
                            });
                    })
                    .catch((error) => {
                        // Handle sign-up error
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        
                        console.error(errorCode, errorMessage);
                    });
            } else {
                // Sign in existing user
                signInWithEmailAndPassword(auth, email, password)
                    .then(() => {
                        // Navigate to home page after successful sign-in
                        navigate("/");
                    })
                    .catch((error) => {
                        // Handle sign-in error
                        const errorCode = error.code;
                        const errorMessage = error.message;

                        console.error(errorCode);
                        console.error(errorMessage);

                        // Set an alert for failed sign-in
                        setState({ ...state, alert: 'Fail! Login or Password incorrect' });
                    });

                // Navigate to home page after sign-in
                navigate("/");
            }
        } catch (error) {
            // Handle general error during authentication
            console.error("Error:", error.code, error.message);
            setState({ ...state, error: error.message });
        }
    };

    // Render child components using the provided render prop function
    return children({ state, setState, submit, navigate });
};


export default AuthContainer;