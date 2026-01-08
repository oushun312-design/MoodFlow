import React from 'react';
import { MoodConfig } from '../types';

interface MoodTagProps {
  config: MoodConfig;
  isSelected: boolean;
  onClick: () => void;
}

const MoodTag: React.FC<MoodTagProps> = ({ config, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center w-[56px] h-[32px] rounded-full transition-all duration-300 shrink-0 bg-white border
        ${isSelected 
          ? 'border-[#82BDB3]' 
          : 'border-transparent active:scale-95'}
      `}
    >
      <span className={`
        text-[12px] font-medium leading-none tracking-tight text-[#414141] transition-opacity duration-300
        ${isSelected ? 'opacity-100' : 'opacity-40'}
      `}>
        {config.label}
      </span>
    </button>
  );
};

export default MoodTag;