import React from 'react';
import LabResultCard from './LabResultCard';
import PatientOverviewChatBox from './PatientOverviewChatBox';

function Demo() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-200">
      {/* Render the lab result cards */}
      <div className="w-3/5 mt-10">
        <LabResultCard
          proteinName="Amyloid Beta 42 (Aβ42)"
          normalRange="550–900 pg/mL"
          patientValue="450"
          interpretation="Your levels of Aβ42 are lower than the typical range. This can suggest that there might be changes in your brain involving amyloid plaques, which are common in people with Alzheimer’s disease. These plaques are like “sticky spots” that can disrupt normal brain activity."
        />
      </div>

      <div className="w-3/5 mt-10">
        <LabResultCard
          proteinName="Total Tau (t-tau)"
          normalRange="100–400 pg/mL"
          patientValue="450"
          interpretation="Your t-tau level is a bit higher than usual. This may indicate some stress or damage to brain cells. Think of it as wear and tear in the brain, which can happen as part of Alzheimer’s disease."
        />
      </div>

      <div className="w-3/5 mt-10">
        <LabResultCard
          proteinName="Phosphorylated Tau (p-tau)"
          normalRange="20–60 pg/mL"
          patientValue="90"
          interpretation="The p-tau level in your results is elevated. This could suggest that a protein in your brain is “misfolding” or tangling, which may interfere with how brain cells communicate. This tangling is often seen in Alzheimer’s disease."
        />
      </div>

      <div className="w-3/5 mt-10">
        <LabResultCard
          proteinName="Neurofilament Light Chain (NfL)"
          normalRange="2–10 pg/mL"
          patientValue="1.8"
          interpretation="Your NfL levels are slightly below the normal range, which may indicate..."
        />
      </div>

      {/* Comprehensive overview / chatbox section */}
      <div className="w-3/5 mt-10 mb-20">
        <PatientOverviewChatBox />
      </div>
      <div className="mb-20"> 
        A CapRx Demo for CS:3980 by Zak, Eli, Haleigh, and Mike
      </div>
    </div>
  );
}

export default Demo;


