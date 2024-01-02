import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


export const loginWithGoogle = async (auth, navigate) => {
    const GoogleProvider = new GoogleAuthProvider();


    signInWithPopup(auth, GoogleProvider)
        .then((result) => {
            const user = result.user;
            console.log(user);

            navigate("/");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            
            console.log(errorCode, errorMessage, email, credential);    
        });
}   