// ChatRow.jsx
import React, { useState, useEffect } from 'react';
import ChatProfileBubble from './ChatProfileBubble';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'

function ChatRow({ chatContent, originatingUser }) {
    const isUser = originatingUser === 'user';
    const isBot = originatingUser === 'bot';

    const chatBubbleClasses = `
        bg-white w-3/4 py-4 px-6 
        ${isUser ? 'rounded-l-2xl rounded-t-2xl ml-2 ' : ''}
        ${isBot ? 'rounded-r-2xl rounded-b-2xl mr-2' : ''}
    `;

    const contentClass = `
        w-8/9 flex flex-row
        ${isUser ? 'justify-end' : ''}
        ${isBot ? 'justify-start' : ''}
    `;

    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasTyped, setHasTyped] = useState(false)
    useEffect(() => {
        const sanitizedText = typeof chatContent === 'string' ? chatContent : String(chatContent);

        if (isBot && !hasTyped && sanitizedText.length > 0) {
            setHasTyped(true)
            let index = 0;
            setIsTyping(true);
            setDisplayedText(''); // Ensure it starts from empty

            const typingSpeed = 15; // milliseconds per character
            const type = () => {
                if (index < sanitizedText.length) {
                    setDisplayedText(prev => prev + sanitizedText.charAt(index)); // Add one character at a time
                    index++;
                    setTimeout(type, typingSpeed);
                } else {
                    setIsTyping(false); // End typing
                }
            };
            type();
        }
    }, [isBot, chatContent, hasTyped]);    const contentToRender = isBot ? displayedText : chatContent;

    return (
        <div className={`w-full flex flex-row transform transition-transform duration-300 animate-popIn`}>
            {/* Left Profile Bubble (Bot) */}
            <div className="w-1/12 flex flex-col justify-start items-center pb-6">
                {isBot && (<ChatProfileBubble user="bot" />)}
            </div>
            {/* Chat Content */}
            <div className={contentClass}>
                <div className={chatBubbleClasses}>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {contentToRender}
                    </ReactMarkdown>
                    {isBot && isTyping && (
                        <span className="inline-block w-2 h-2 ml-1 bg-gray-700 rounded-full animate-bounce"></span>
                    )}
                </div>
            </div>
            {/* Right Profile Bubble (User) */}
            <div className="w-1/12 flex flex-col justify-end items-center pt-6">
                {isUser && (<ChatProfileBubble user="user" />)}
            </div>
        </div>
    );
}


// Helper function to tokenize HTML content
function tokenizeHTML(html) {
    const regex = /(<[^>]+>)/g;
    const tokens = html.split(regex).filter(token => token.length > 0);
    return tokens;
}

// PropTypes for type checking
ChatRow.propTypes = {
    chatContent: PropTypes.string.isRequired,
    originatingUser: PropTypes.oneOf(['user', 'bot']).isRequired,
};

export default ChatRow;

