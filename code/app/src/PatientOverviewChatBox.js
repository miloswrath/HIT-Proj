import React, { useState, useRef } from 'react';
import ConnectedChatWindow from './ConnectedChatWindow';

function PatientOverviewChatBox() {
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
     </div>
   );
}

export default PatientOverviewChatBox;
