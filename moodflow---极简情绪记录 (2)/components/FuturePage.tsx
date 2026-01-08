import React, { useState } from 'react';
import { FutureLetter, FutureDuration } from '../types.ts';

interface FuturePageProps {
  letters: FutureLetter[];
  onAddLetter: (content: string, duration: FutureDuration) => void;
}

const durations: FutureDuration[] = ['一周后', '一个月后', '三个月后'];

const FuturePage: React.FC<FuturePageProps> = ({ letters, onAddLetter }) => {
  const [content, setContent] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<FutureDuration | null>(null);

  const handleSubmit = () => {
    if (!content.trim() || !selectedDuration) return;
    onAddLetter(content, selectedDuration);
    setContent('');
    setSelectedDuration(null); // 提交后重置为不选中状态
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${y}.${m}.${d} ${h}:${min}`;
  };

  const isReady = content.trim() && selectedDuration;

  return (
    <main className="px-5 flex-1 pt-6 pb-20 animate-in fade-in duration-500">
      <div className="mb-8 px-1">
        <h1 className="text-[26px] font-bold text-[#333333] tracking-tight">
          写给未来自己的话
        </h1>
      </div>

      {/* Write Letter Card */}
      <section className="bg-[#f5f5f5] rounded-[24px] p-8 mb-12 flex flex-col">
        <div className="w-full relative min-h-[160px] mb-8 group">
          {!content && (
            <div className="absolute top-1 left-0 flex items-center gap-2 text-gray-300 pointer-events-none transition-opacity group-focus-within:opacity-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="text-lg">把现在的感受写下来</span>
            </div>
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-lg text-gray-700 resize-none min-h-[160px] leading-relaxed"
          />
        </div>

        {/* Duration Select - 72x32, 初始静默状态（无描边、文字正常） */}
        <div className="flex justify-between items-center mb-10 px-2">
          {durations.map((d) => {
            const isSelected = selectedDuration === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDuration(d)}
                className={`
                  w-[72px] h-[32px] rounded-full flex items-center justify-center transition-all duration-300 bg-white border
                  ${isSelected 
                    ? 'border-[#82BDB3]' 
                    : 'border-transparent'}
                `}
              >
                <span className="text-[12px] font-medium leading-none whitespace-nowrap text-[#414141]">
                  {d}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isReady}
          className={`
            w-full py-4 rounded-full text-lg font-bold transition-all
            ${isReady 
              ? 'bg-[#18E6C4] text-gray-800 active:scale-[0.98]' 
              : 'bg-[#C9F2EB] text-[#8E9A98] cursor-not-allowed'}
          `}
        >
          放进时间里
        </button>
      </section>

      {/* Letter History */}
      <section>
        <div className="mb-6 px-1">
          <h2 className="text-xl font-bold text-[#333333]">已写的信</h2>
        </div>
        <div className="space-y-4">
          {letters.length > 0 ? (
            letters.map((letter) => (
              <div key={letter.id} className="bg-[#f5f5f5] rounded-[24px] p-6">
                <p className="text-[#414141] text-[15px] leading-relaxed mb-6">
                  {letter.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="bg-white px-4 py-1.5 rounded-full text-[12px] font-medium text-[#414141]">
                    将在{letter.duration}出现
                  </div>
                  <div className="text-[#9ca3af] text-[12px]">
                    {formatDate(letter.timestamp)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-300 font-light">
              还没有写给未来的信
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default FuturePage;