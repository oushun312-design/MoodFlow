import React from 'react';
import { MoodEntry } from '../types';
import { MOOD_CONFIGS } from '../constants';

interface HistoryItemProps {
  entry: MoodEntry;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ entry }) => {
  const config = MOOD_CONFIGS[entry.mood];
  const timeStr = entry.timestamp.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  }).replace('AM', '上午').replace('PM', '下午');

  return (
    <div className="bg-[#f5f5f5] rounded-[24px] p-6 mb-4">
      <p className="text-[#374151] text-lg leading-relaxed mb-6 font-normal">
        {entry.content}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center px-4 py-1.5 bg-white rounded-full">
          <span className="text-[#4b5563] text-sm font-medium">{config.label}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#9ca3af]">
           <span className="text-[10px] opacity-60">●</span>
           <span className="text-sm tracking-tight">{timeStr}</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;