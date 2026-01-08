
import React, { useState, useEffect } from 'react';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="w-full h-11 px-6 flex justify-between items-center bg-white sticky top-0 z-[60]">
      <div className="text-[15px] font-semibold text-gray-900 tracking-tight">
        {timeString}
      </div>
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg className="w-[17px] h-[11px]" viewBox="0 0 17 11" fill="none">
          <rect x="0.5" y="7" width="3" height="3" rx="1" fill="currentColor" className="text-gray-900" />
          <rect x="4.5" y="5" width="3" height="5" rx="1" fill="currentColor" className="text-gray-900" />
          <rect x="8.5" y="2.5" width="3" height="7.5" rx="1" fill="currentColor" className="text-gray-900" />
          <rect x="12.5" y="0" width="3" height="10" rx="1" fill="currentColor" className="text-gray-400 opacity-30" />
        </svg>
        {/* Wi-Fi */}
        <svg className="w-[16px] h-[12px]" viewBox="0 0 16 12" fill="none">
          <path d="M8 12L1.5 4.5C4-0.5 12-0.5 14.5 4.5L8 12Z" fill="currentColor" className="text-gray-900" />
        </svg>
        {/* Battery */}
        <div className="relative w-[22px] h-[11px] rounded-[3px] border border-gray-900/30 flex items-center p-[1px]">
          <div className="h-full w-[14px] bg-gray-900 rounded-[1px]"></div>
          <div className="absolute -right-[3px] top-[3.5px] w-[2px] h-[4px] bg-gray-900/30 rounded-r-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
