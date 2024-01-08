import { useEffect, useState } from 'react';

// firebase
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// styles
import './styles/home.scss';

import './styles/sideBar/side_bar.scss';
import "./styles/sideBar/chats.scss";
import './styles/sideBar/modalWindow.scss';

import './styles/profile/profile.scss';

import './styles/chat/panel_chat.scss';
import './styles/chat/chat.scss';

// controllers
import SideBar from './controllers/sideBar/SideBar';
import Chat from './controllers/chat/Chat';
import Profile from './controllers/profile/Profile';


const LoadedHome = () => {
    let [isAuth, setIsAuth] = useState(false);

    // set data user if auth
    const [user, setUser] = useState();


    useEffect(() => {
        // check if user auth
        onAuthStateChanged(auth, (user) => {
            if (user) {
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
                    <SideBar currentUser={user} />
                    <Profile user={user} />
                    <Chat currentUser={user} />
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