import React, { useState, useMemo } from 'react';
import { MoodEntry } from '../types';
import HistoryItem from './HistoryItem';

interface ReviewPageProps {
  history: MoodEntry[];
}

type ViewMode = 'GRID' | 'DETAIL';

const ReviewPage: React.FC<ReviewPageProps> = ({ history }) => {
  // 当前视图显示的年月，默认设置为当前系统时间
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // 计算当月天数
  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
  
  // 计算当月第一天是周几 (0是周日)
  const firstDayOfMonth = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newSelected = new Date(year, month, day);
    setSelectedDate(newSelected);
    setViewMode('DETAIL');
  };

  // 根据传入的 history 计算当前月份中有记录的日期集合
  const recordedDaysSet = useMemo(() => {
    const days = new Set<number>();
    history.forEach(entry => {
      const d = new Date(entry.timestamp);
      if (d.getFullYear() === year && d.getMonth() === month) {
        days.add(d.getDate());
      }
    });
    return days;
  }, [history, year, month]);

  // 检查特定日期是否有记录
  const checkHasRecord = (d: Date) => {
    return history.some(entry => {
      const date = new Date(entry.timestamp);
      return (
        date.getFullYear() === d.getFullYear() &&
        date.getMonth() === d.getMonth() &&
        date.getDate() === d.getDate()
      );
    });
  };

  // 过滤出选中日期的记录
  const dailyHistory = useMemo(() => {
    if (!selectedDate) return [];
    return history.filter(entry => {
      const d = new Date(entry.timestamp);
      return (
        d.getFullYear() === selectedDate.getFullYear() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getDate() === selectedDate.getDate()
      );
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [history, selectedDate]);

  // 生成详情页顶部的水平日期条（固定展示6个日期按钮，配合最后的下拉按钮共7个）
  const horizontalDays = useMemo(() => {
    if (!selectedDate) return [];
    const days = [];
    const currentDayNum = selectedDate.getDate();
    
    // 计算起始日期，尽量让选中日期居中
    let startDay = currentDayNum - 2; // 调整为更偏向左侧一点，让出空间
    
    // 边界处理：防止超出当月范围
    if (startDay < 1) {
      startDay = 1;
    }
    if (startDay + 5 > daysInMonth) {
      startDay = Math.max(1, daysInMonth - 5);
    }

    for (let i = 0; i < 6; i++) {
      const d = startDay + i;
      if (d <= daysInMonth) {
        days.push(new Date(year, month, d));
      }
    }
    return days;
  }, [selectedDate, month, year, daysInMonth]);

  if (viewMode === 'DETAIL' && selectedDate) {
    return (
      <main className="px-[13px] flex-1 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6 px-[11px]">
          <div>
            <h1 className="text-[32px] font-bold text-[#333333] tracking-tight leading-tight">
              {year}年{month + 1}月
            </h1>
            <p className="text-[#999999] text-sm mt-1">这些天，有一些感受被留下来</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full bg-[#4A4A4A] flex items-center justify-center text-white active:scale-90 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button onClick={handleNextMonth} className="w-8 h-8 rounded-full bg-[#4A4A4A] flex items-center justify-center text-white active:scale-90 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Date Strip - 7个按钮，尺寸 43x43, 间距 8px */}
        <div className="flex items-center gap-[8px] mb-8 overflow-hidden">
          {horizontalDays.map((d) => {
            const isSelected = d.getDate() === selectedDate.getDate();
            const hasRecord = checkHasRecord(d);
            return (
              <button
                key={d.getTime()}
                disabled={!hasRecord}
                onClick={() => setSelectedDate(new Date(d))}
                className={`
                  w-[43px] h-[43px] shrink-0 flex items-center justify-center rounded-[14px] text-sm font-medium transition-all
                  ${isSelected ? 'bg-[#D1F4EA] text-[#333333]' : 'bg-[#F5F5F5] text-[#999999]'}
                  ${!hasRecord && !isSelected ? 'opacity-40 grayscale-[0.5]' : ''}
                  ${hasRecord ? 'active:scale-90 cursor-pointer' : 'cursor-default'}
                `}
              >
                {d.getDate()}
              </button>
            );
          })}
          <button 
            onClick={() => setViewMode('GRID')}
            className="w-[43px] h-[43px] shrink-0 flex items-center justify-center rounded-[14px] bg-[#F5F5F5] text-[#666666] active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>

        <div className="mb-3 px-[11px]">
          <h2 className="text-xl font-bold text-[#333333]">
            {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}号
          </h2>
        </div>

        <div className="space-y-4 pb-10 px-[11px]">
          {dailyHistory.length > 0 ? (
            dailyHistory.map(entry => (
              <HistoryItem key={entry.id} entry={entry} />
            ))
          ) : (
            <div className="py-20 text-center text-gray-300 font-light">
              这天还没有留下感受
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="px-[13px] flex-1 pt-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-2 px-[11px]">
        <div>
          <h1 className="text-[32px] font-bold text-[#333333] tracking-tight leading-tight">
            {year}年{month + 1}月
          </h1>
          <p className="text-[#999999] text-sm mt-1">这些天，有一些感受被留下来</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full bg-[#4A4A4A] flex items-center justify-center text-white active:scale-90 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button onClick={handleNextMonth} className="w-8 h-8 rounded-full bg-[#4A4A4A] flex items-center justify-center text-white active:scale-90 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-[8px] mt-10">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="w-[43px] h-[43px]" />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const hasRecord = recordedDaysSet.has(day); 
          
          return (
            <button
              key={day}
              disabled={!hasRecord}
              onClick={() => handleDateClick(day)}
              className={`
                w-[43px] h-[43px] flex items-center justify-center rounded-[12px] text-sm font-medium transition-all duration-300
                ${hasRecord 
                  ? 'bg-[#D1F4EA] text-gray-700 active:scale-90 cursor-pointer shadow-sm shadow-emerald-100' 
                  : 'bg-[#F5F5F5] text-gray-400 cursor-default opacity-80'}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </main>
  );
};

export default ReviewPage;