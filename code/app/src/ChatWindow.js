import React, { useState, useImperativeHandle, forwardRef } from 'react';
import ChatRow from './ChatRow';
import PreMessage from './PreMessage';

const ChatWindow = forwardRef(({ preMessageContent, interpretation }, ref) => {
    const [messages, setMessages] = useState([]);
    const [showPreMessage, setShowPreMessage] = useState(true);
    const [isPreMessageExiting, setIsPreMessageExiting] = useState(false);
  // Expose addMessage function to parent via ref
     useImperativeHandle(ref, () => ({
      /**
       * Adds a new message to the chat and sends it to the server.
       * @param {string} chatContent - The content of the chat message.
       * @param {string} originatingUser - The user who originated the message.
       */
      addMessage: async (chatContent, originatingUser) => {
          const newMessage = { chatContent, originatingUser };
          const updatedMessages = [...messages, newMessage];

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

              // Update the messages state with the new message
            const updateMessagesWithBotResponse = [...updatedMessages, { chatContent: data.response, originatingUser: 'bot '}];
            setMessages(updateMessagesWithBotResponse)
          } catch (error) {
              console.error('Error sending message to server:', error);
          }
      },
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
                    { chatContent: interpretation, originatingUser: 'bot' },
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
