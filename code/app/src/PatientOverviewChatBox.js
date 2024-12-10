import React from 'react';
import ChatWindow from './ChatWindow';


function PatientOverviewChatBox() {
  return (
    <div className="w-full bg-white rounded-md p-4 flex flex-col gap-5 mb-10 shadow-md">
        <div className="flex flex-col mx-2">
            <span className="text-black text-md font-bold leading-5">Your Health Overview</span>
            <span className="text-[#9c9c9c] text-sm font-semibold leading-5 mt-1"> Discuss and interpret your results with our AI assistant </span>
        </div>
        <ChatWindow
            preMessageContent="What do my results mean?" 
            interpretation="Compared to earlier results, your latest biomarker measurements show small but noticeable changes that suggest a gradual worsening in brain health. Here’s what we’re seeing:<br/><br/> <b>1. Amyloid Beta 42 (Aβ42):</b> Your levels have decreased slightly over time. This means there may be more buildup of amyloid plaques in your brain, which can disrupt its normal function.<br/><br/> <b>2. Total Tau (t-tau):</b> Your t-tau levels have risen a little more than before, which could mean increased stress or damage to your brain cells.<br/><br/> <b>3. Phosphorylated Tau (p-tau):</b> The p-tau levels are a bit higher now compared to previous tests. This points to ongoing changes in proteins in your brain that may affect how brain cells work and communicate.<br/><br/> <b>4. Neurofilament Light Chain (NfL):</b> Your NfL levels have gone up slightly, which suggests continued stress on the connections between brain cells.<br/><br/><br/><b>What This Means:</b><br/>These results show that the changes in your brain are progressing slowly over time. While the changes are not large, they are a sign that the disease may be moving forward. It’s important to stay on top of these trends with regular check-ins and discussions about care options. Your healthcare team is here to help you navigate this and focus on the best strategies for your health."
        />
    </div>
  );
}

export default PatientOverviewChatBox;

