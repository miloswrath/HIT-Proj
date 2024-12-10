import React, { useState, useRef } from 'react';
import ConnectedChatWindow from './ConnectedChatWindow';

function PatientOverviewChatBox() {
   const [userQuery, setUserQuery] = useState('');
   const chatWindowRef = useRef(null);

   const handleInputChange = (e) => {
     setUserQuery(e.target.value);
   };

   const handleSendMessage = async () => {
     if (userQuery.trim() === '') return;

     // Call the addMessage function on ChatWindow via the ref
     if (chatWindowRef.current) {
       await chatWindowRef.current.addMessage(userQuery, 'user');
       setUserQuery('');
     }
   };

   return (
     <div className="w-full bg-white rounded-md p-4 flex flex-col gap-5 mb-10 shadow-md">
       <div className="flex flex-col mx-2">
         <span className="text-black text-md font-bold leading-5">Your Health Overview</span>
         <span className="text-[#9c9c9c] text-sm font-semibold leading-5 mt-1">
           Discuss and interpret your results with our AI assistant
         </span>
       </div>
       <ConnectedChatWindow
         preMessageContent="What do my results mean?" 
         interpretation="CCompared to earlier results, your latest biomarker measurements show small but noticeable changes that suggest a gradual worsening in brain health. ..."
       />
       <div className="flex items-center gap-2 mt-4">
         <input
           type="text"
           value={userQuery}
           onChange={handleInputChange}
           className="flex-1 rounded-md border border-gray-300 p-2"
           placeholder="Ask a follow-up question..."
         />
         <button
           onClick={handleSendMessage}
           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
         >
           Send
         </button>
       </div>
     </div>
   );
}

export default PatientOverviewChatBox;
