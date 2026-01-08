import React from 'react';

const Header: React.FC = () => {
  const now = new Date();
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  
  return (
    <header className="px-6 pt-10 pb-6 flex flex-col items-start">
      <span className="text-[#9ca3af] text-sm font-medium tracking-wide mb-1">
        {weekDays[now.getDay()]}
      </span>
      <h1 className="text-3xl font-bold text-[#1f2937] tracking-tight">
        {month}月{day}日
      </h1>
    </header>
  );
};

export default Header;