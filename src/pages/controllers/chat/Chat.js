import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { onSnapshot, doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";

import send from "../../../assets/icons/send.svg";
import clip from "../../../assets/icons/clip.svg";
import img from "../../../assets/icons/img.svg";


const Chat = ({ currentUser }) => {
    const { chatId } = useParams();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [img_send, setImg] = useState(null);


    useEffect(() => {
        if (chatId) {
            const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
                if (doc.exists()) {
                    setMessages(doc.data().messages);
                }
            });
    
    
            return () => {
                unSub();
            };
        }
    }, [chatId]);  
    
    
    const handleSend = async () => {
        if (chatId) {
            if (img_send) {
    
            } else {
                setMessages((prevMessages) => [
                    {
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                    },
                    ...prevMessages,
                ]);
                
                await updateDoc(doc(db, "chats", chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now()
                    })
                });
            }
        }
    };

    

    return (
        <div className="chat">
            <div className="messages">
                {messages.map((m) => (
                    m.senderId === currentUser.uid ? (
                        <div key={m.id} className="bubble-own-message">
                            <h2 className="text-own-message">{m.text}</h2>
                        </div>
                    ) : (
                        <div key={m.id} className="bubble-companion-message">
                            <h2 className="text-companion-message">{m.text}</h2>
                        </div>
                    )
                ))}
            </div>


            <div className="block-input">
                <input className="field-input" type="text" placeholder="Type something..." onChange={e => setText(e.target.value)} />

                <img
                    src={clip}
                    className="clip"
                    alt="clip"
                />

                <img
                    src={img}
                    className="img"
                    alt="img"
                />

                <div className="box-send" onClick={handleSend}>
                    <img
                        src={send}
                        className="send"
                        alt="send"
                    />
                </div>
            </div>
        </div>
    )
}


export default Chat;