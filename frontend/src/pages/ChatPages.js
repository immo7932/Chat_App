import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatPages = () => {
    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/chat');
            const data = response.data.chats;
            if (Array.isArray(data)) {
                setChats(data);
            } else {
                console.error('Expected an array of chats:', data);
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        console.log('Chats state:', chats);
    }, [chats]);

    return (
        <>
            <div>
                {Array.isArray(chats) ? (
                    chats.map((chat) => (
                        <div key={chat._id}>{chat.chatName}</div>
                    ))
                ) : (
                    <div>No chats available</div>
                )}
            </div>
        </>
    );
};

export default ChatPages;
