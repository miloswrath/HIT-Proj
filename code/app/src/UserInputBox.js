import {React, useState, useRef} from 'react';
import ChatProfileBubble from './ChatProfileBubble';

function UserInputBox({ isExiting, addMessage }) {
    const [userQuery, setUserQuery] = useState('What do my results mean?');
    const handleInputChange = (e) => {
        setUserQuery(e.target.value);
    };
    const handleSendMessage = async () => {
        if (userQuery.trim() === '') return;
        // Call the addMessage function
        setUserQuery('');
        await addMessage(userQuery, 'user');
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };
    return (
        <div className={`w-full flex flex-row ${isExiting ? 'animate-popOut' : ''}`}>
            <hr/>
            {/* Left Spacer */}
            <div className="w-1/12 flex flex-col justify-center items-center pb-6"></div>

            {/* PreMessage Content */}
            <div className="w-8/9 flex flex-row justify-end">
                <input
                    type="text"
                    value={userQuery}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="bg-white w-full py-4 px-6 rounded-2xl cursor-pointer text-gray-700 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-gray-800 "
                    placeholder={userQuery.length === 0 ? 'Ask a question...' : ''}
                >
                </input>
            </div>
            {/* Right Profile Bubble (User) */}
            <div className="w-1/12 flex flex-col justify-center items-center">
                <ChatProfileBubble user="user" />
            </div>
        </div>
    );
}

export default UserInputBox;