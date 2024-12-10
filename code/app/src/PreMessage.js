import React from 'react';
import ChatProfileBubble from './ChatProfileBubble';

function PreMessage({ chatContent, onClick, isExiting }) {
    return (
        <div className={`w-full flex flex-row ${isExiting ? 'animate-popOut' : ''}`}>
            {/* Left Spacer */}
            <div className="w-1/12 flex flex-col justify-center items-center pb-6"></div>

            {/* PreMessage Content */}
            <div className="w-8/9 flex flex-row justify-end">
                <div
                    className="bg-white w-full py-4 px-6 rounded-2xl border border-gray-500 cursor-pointer hover:p-5 transition-all duration-300"
                    onClick={onClick}
                    role="button"
                    tabIndex={0}
                >
                    <p className="text-gray-700 text-sm font-semibold leading-5 whitespace-pre-wrap">
                        {chatContent}
                    </p>
                </div>
            </div>
            {/* Right Profile Bubble (User) */}
            <div className="w-1/12 flex flex-col justify-center items-center">
                <ChatProfileBubble user="user" />
            </div>
        </div>
    );
}

export default PreMessage;
