import React, { useState, useImperativeHandle, forwardRef } from 'react'; 
import ChatRow from './ChatRow';
import PreMessage from './PreMessage';

const ChatWindow = forwardRef(({ preMessageContent, interpretation }, ref) => {
    const [messages, setMessages] = useState([]);
    const [showPreMessage, setShowPreMessage] = useState(true);
    const [isPreMessageExiting, setIsPreMessageExiting] = useState(false);

    // Expose addMessage function to parent via ref
    useImperativeHandle(ref, () => ({
        addMessage: (chatContent, originatingUser) => {
            console.log('STANDARD_Window_AddMessage_Proc')
            setMessages(prevMessages => [...prevMessages, { chatContent, originatingUser }]);
        }
    }));

    // Handler for PreMessage click
    const handlePreMessageClick = () => {
        // Start exit animation
        setIsPreMessageExiting(true);
        setTimeout(() => {
            setMessages(prevMessages => [
                ...prevMessages, 
                { chatContent: preMessageContent, originatingUser: 'user' }
            ]);
            // After a small delay, add bot ChatRow
            setTimeout(() => {
                setMessages(prevMessages => [
                    ...prevMessages, 
                    { chatContent: interpretation, originatingUser: 'bot' }
                ]);
            }, 1250); // Delay between user and bot messages (300ms)
            // Hide the PreMessage component
            setShowPreMessage(false);
            setIsPreMessageExiting(false);
        }, 150); // Match the popOut animation duration (0.3s)
    };

    return (
        <div className="bg-gray-300 rounded-xl py-4 flex flex-col mx-2 shadow-md shadow-inner space-y-6 transition-all duration-500">
            {/* Conditionally render PreMessage with animation */}
            {showPreMessage && (
                <PreMessage 
                    chatContent={preMessageContent} 
                    onClick={handlePreMessageClick} 
                    isExiting={isPreMessageExiting}
                />
            )}
            
            {/* Render ChatRows with animation */}
            {messages.map((message, index) => (
                <ChatRow
                    key={index}
                    chatContent={message.chatContent}
                    originatingUser={message.originatingUser}
                />
            ))}
        </div>
    );
});

export default ChatWindow;
