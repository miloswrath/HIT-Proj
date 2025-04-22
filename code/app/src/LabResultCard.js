import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';

function LabResultCard({ proteinName, normalRange, patientValue, interpretation }) {
    const {
      minValue,
      maxValue,
      unit,
      outerMin,
      outerMax,
      innerBarStartPercent,
      innerBarWidthPercent,
      patientPercent
    } = calculateBarPositions(normalRange, patientValue);

    const [showInterpretation, setShowInterpretation] = useState(false);
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
      let intervalId;
      if (showInterpretation && displayedText.length < interpretation.length) {
        intervalId = setInterval(() => {
          setDisplayedText((prev) => interpretation.substring(0, prev.length + 1));
        }, 10); // Adjust typing speed here if desired
      }
      return () => clearInterval(intervalId);
    }, [showInterpretation, displayedText, interpretation]);

    const handleShowInterpretation = () => {
      if (!showInterpretation) {
        setShowInterpretation(true);
      }
    };

    return (
      <div className="w-full bg-[#fffbfb] rounded-md p-4 shadow-md transition-all duration-300">
        {/* Header Section */}
        <div className="flex flex-col mx-2">
          <span className="text-black text-md font-bold leading-5">{proteinName}</span>
          <span className="text-[#9c9c9c] text-sm font-semibold leading-5 mt-1 mb-7">
            Normal range: {normalRange}
          </span>
        </div>

        {/* Visualization Section */}
        <div className="my-2 mx-2 mb-5">
          <div className="relative mt-6">
            {/* Patient Value Bubble */}
            <div
              className="absolute flex justify-center items-center w-12 h-12"
              style={{
                left: `${patientPercent}%`,
                top: '-3.25rem',
                transform: 'translateX(-50%)'
              }}
            >
              <svg viewBox="-5 -150 750 750" className="w-12 h-12">
                <path d="M515.72 260c-22.09 0-40-17.909-40-40s17.91-40 40-40c22.091 0 40 17.909 40 40s-17.909 40-40 40zm-148 0c-22.09 0-40-17.909-40-40s17.91-40 40-40c22.091 0 40 17.909 40 40s-17.909 40-40 40zm-148 0c-22.09 0-40-17.909-40-40s17.91-40 40-40c22.091 0 40 17.909 40 40s-17.909 40-40 40z"/>
                <path d="M678.826 0H60C26.863 0 0 26.863 0 60v320c0 33.137 26.863 60 60 60h229.016a20 20 0 0 1 16.641 8.906l30.97 46.453a37.371 37.371 0 0 0 62.187 0l30.97-46.453a20 20 0 0 1 16.64-8.906h232.402c33.137 0 60-26.863 60-60V60c0-33.137-26.863-60-60-60z"
                  fill="#FFC626"
                  stroke="#FFC626"/>
                <text 
                  x="49%" 
                  y="32%" 
                  dominantBaseline="middle" 
                  textAnchor="middle" 
                  fill="white" 
                  fontSize="250" 
                  fontWeight="bold"
                >
                  {patientValue}
                </text>
              </svg>
            </div>
  
            {/* Outer Bar */}
            <div className="w-full h-[27px] bg-[#FFC626] rounded-md overflow-hidden relative shadow-md">
              {/* Inner (Green) Bar */}
              <div 
                className="h-full bg-[#4CAF50] rounded-md absolute top-0"
                style={{
                  left: `${innerBarStartPercent}%`,
                  width: `${innerBarWidthPercent}%`
                }}
              />
            </div>
  
            {/* Labels under the bar */}
            <div className="relative w-full text-xs text-gray-800 mt-2 h-4">
              <div className="absolute font-semibold text-[#9c9c9c] left-0">
                {outerMin.toFixed ? outerMin.toFixed(1) : outerMin} 
              </div>
              <div 
                className="absolute font-semibold text-[#9c9c9c]"
                style={{
                  left: `${innerBarStartPercent}%`, 
                  transform: 'translateX(-50%)'
                }}
              >
                {minValue} 
              </div>
              <div 
                className="absolute font-semibold text-[#9c9c9c]"
                style={{
                  left: `${innerBarStartPercent + innerBarWidthPercent}%`, 
                  transform: 'translateX(-50%)'
                }}
              >
                {maxValue} 
              </div>
              <div 
                className="absolute font-semibold text-[#9c9c9c]"
                style={{
                  left: '100%', 
                  transform: 'translateX(-100%)'
                }}
              >
                {outerMax.toFixed ? outerMax.toFixed(1) : outerMax} 
              </div>
            </div>
          </div>
        </div>
        <ChatWindow 
            preMessageContent="What does this result mean?" 
            interpretation={interpretation} 
        />
      </div>
    );
}

export default LabResultCard;


function calculateBarPositions(normalRange, patientValue) {
    const rangeMatch = normalRange.match(/(\d+(\.\d+)?)\s*[–-]\s*(\d+(\.\d+)?)/);
    const unitMatch = normalRange.match(/[a-zA-Zµ\/]+/);
  
    let minValue = 0;
    let maxValue = 100;
    let unit = '';
  
    if (rangeMatch) {
      const parsedMin = parseFloat(rangeMatch[1]);
      const parsedMax = parseFloat(rangeMatch[3]);
      if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
        minValue = parsedMin;
        maxValue = parsedMax;
      } else {
        console.warn("Could not parse numbers from normalRange:", normalRange);
      }
    } else {
      console.warn("Could not find a numeric range in normalRange:", normalRange);
    }
  
    if (unitMatch) {
      unit = unitMatch[0];
    }
  
    const range = maxValue - minValue;

    let outerMin = minValue - range * 0.1; 
    let outerMax = maxValue + range * 0.1;

    if (patientValue > outerMax) {
      outerMax = patientValue;
    }
    if (patientValue < outerMin) {
      outerMin = patientValue;
    }

    if (isNaN(outerMin)) outerMin = minValue;
    if (isNaN(outerMax)) outerMax = maxValue;
  
    if (outerMax === outerMin) {
      outerMax = outerMin + 100;
    }

    outerMax*=1.05
    outerMin*=0.95
  
    const totalRange = outerMax - outerMin;
  
    const innerBarStartPercent = ((minValue - outerMin) / totalRange) * 100;
    const innerBarWidthPercent = ((maxValue - minValue) / totalRange) * 100;
    const patientPercent = ((patientValue - outerMin) / totalRange) * 100;
  
    return {
      minValue,
      maxValue,
      unit,
      outerMin,
      outerMax,
      innerBarStartPercent,
      innerBarWidthPercent,
      patientPercent
    };
}
