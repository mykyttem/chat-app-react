import { useEffect, useState } from 'react';

// firebase
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from '../firebase';


// styles
import './styles/home.scss';
import './styles/side_bar.scss';
import './styles/profile.scss';
import './styles/panel_chat.scss';
import './styles/chat.scss';

// components
import SideBar from './components/SideBar';
import Chat from './components/Chat';
import Profile from './components/Profile';
import PanelChat from './components/panel_chat';


const LoadedHome = () => {
    let [isAuth, setIsAuth] = useState(false);

    // set data user if auth
    const [user, setUser] = useState();

    
    useEffect(() => {
        // check if user auth
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // save in db data user
                const userDocRef = doc(db, "users", user.uid);
                
                const dataUser = {
                    name: user.displayName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    photo: user.photoURL,
                    uid: user.uid
                }

                setDoc(userDocRef, dataUser, { merge: true })

                // set
                setIsAuth(true);
                setUser(user);
            } 
        })
    })


    return (
        <>
            {isAuth ? (
                <div className="home-container">
                    <SideBar />
                    <Profile user={user} />
                    <PanelChat />
                    <Chat />
                </div>
            ) : (
                <div className="block-not-auth">
                    <div className="block-not-auth-content">
                        <h2>Not allowed page</h2>
                        <h2 className="info-not-auth">Please authenticate to access the content</h2>
                        <a className="info-not-auth" href="/sign-up">Sign up</a>
                    </div>
                </div>
            )}
        </>
    );
}


export default LoadedHome;