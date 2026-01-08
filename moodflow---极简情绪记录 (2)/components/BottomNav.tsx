import React from 'react';

export type TabType = '此刻' | '回顾' | '轨迹' | '未来';

interface NavItem {
  label: TabType;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { 
    label: '此刻', 
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  },
  { 
    label: '回顾', 
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path d="M9 10h6M9 14h3" />
      </svg>
    )
  },
  { 
    label: '轨迹', 
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12c3-3 6-3 9 0s6 3 9 0" />
      </svg>
    )
  },
  { 
    label: '未来', 
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3v18M3 12h18" strokeDasharray="4 4" />
        <path d="M12 12l4-4m-4 4l-4-4m4 4l4 4m-4-4l-4 4" />
      </svg>
    )
  }
];

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 w-full max-w-[375px] bg-white border-t border-gray-100 px-6 py-3 pb-8 flex justify-between items-center z-50">
      {navItems.map((item) => (
        <button 
          key={item.label} 
          onClick={() => onTabChange(item.label)}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.label ? 'text-gray-800' : 'text-gray-300'}`}
        >
          {item.icon}
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;