import React, { useState, useImperativeHandle, forwardRef } from 'react';
import ChatRow from './ChatRow';
import UserInputBox from './UserInputBox';

const ConnectedChatWindow = forwardRef(({ preMessageContent, interpretation }, ref) => {
    const [messages, setMessages] = useState([]);
    const [showPreMessage, setShowPreMessage] = useState(true);
    const [isPreMessageExiting, setIsPreMessageExiting] = useState(false);
    // Expose addMessage function to parent via ref
    const addMessage = async (chatContent, originatingUser) => {
        const newMessage = { chatContent, originatingUser };
        if (originatingUser === 'user') {
            setMessages(prevMessages => [...prevMessages, newMessage]);
        }
        try {
            const response = await fetch('http://localhost:8000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentMessage: newMessage,
                    previousMessages: messages,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Server response:', data);
    
            // Update messages with the bot's response
            setMessages(prevMessages => [
                ...prevMessages,
                { chatContent: data.response, originatingUser: 'bot' },
            ]);
        } catch (error) {
            console.error('Error sending message to server:', error);
            // Update messages with the bot's response
            setMessages(prevMessages => [
                ...prevMessages,
                { chatContent: `BEEP BOOP. ERROR CONNECTING TO API: \n \n${error}`, originatingUser: 'bot' },
            ]);
        }
    };
    return (
        <div className="bg-gray-300 rounded-xl py-4 flex flex-col mx-2 shadow-md shadow-inner space-y-6 transition-all duration-500">
            {/* Render ChatRows with animation */}
            {messages.map((message, index) => (
                <ChatRow
                    key={index}
                    chatContent={message.chatContent}
                    originatingUser={message.originatingUser}
                />
            ))}
            <UserInputBox addMessage={addMessage}/>
        </div>
    );
});

export default ConnectedChatWindow;
