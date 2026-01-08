import React, { useState, useCallback } from 'react';
import StatusBar from './components/StatusBar.tsx';
import Header from './components/Header.tsx';
import MoodTag from './components/MoodTag.tsx';
import HistoryItem from './components/HistoryItem.tsx';
import BottomNav, { TabType } from './components/BottomNav.tsx';
import ReviewPage from './components/ReviewPage.tsx';
import TrajectoryPage from './components/TrajectoryPage.tsx';
import FuturePage from './components/FuturePage.tsx';
import { MoodType, MoodEntry, FutureLetter, FutureDuration } from './types.ts';
import { MOOD_CONFIGS, INITIAL_HISTORY } from './constants.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('此刻');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [history, setHistory] = useState<MoodEntry[]>(INITIAL_HISTORY);
  
  // 新用户初始数据为空
  const [futureLetters, setFutureLetters] = useState<FutureLetter[]>([]);

  const handleSubmit = useCallback(() => {
    if (!content.trim() || !selectedMood) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      content,
      mood: selectedMood,
      timestamp: new Date()
    };

    setHistory(prev => [newEntry, ...prev]);
    setContent('');
    setSelectedMood(null);
  }, [content, selectedMood]);

  const handleAddFutureLetter = useCallback((letterContent: string, duration: FutureDuration) => {
    const newLetter: FutureLetter = {
      id: Date.now().toString(),
      content: letterContent,
      duration,
      timestamp: new Date()
    };
    setFutureLetters(prev => [newLetter, ...prev]);
  }, []);

  const isReady = content.trim() && selectedMood;

  const renderMomentPage = () => (
    <main className="px-5 flex-1 animate-in fade-in duration-300">
      <section className="bg-[#f5f5f5] rounded-[24px] p-8 mb-10 flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">你现在感觉如何？</h2>
        <p className="text-gray-400 text-sm mb-12 font-light">一句话就够了</p>
        
        <div className="w-full relative group mb-12">
          {!content && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-300 group-focus-within:opacity-0 opacity-100 flex items-center justify-center gap-2 whitespace-nowrap w-full">
               <svg className="w-5 h-5 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="text-gray-300 text-lg">把现在的感受写下来</span>
            </div>
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-center text-lg text-gray-700 resize-none min-h-[40px] hide-scrollbar focus:placeholder-transparent transition-all"
            rows={2}
          />
        </div>

        <div className="flex items-center justify-center gap-2 mb-4 w-full overflow-x-auto hide-scrollbar py-2">
          {(Object.values(MOOD_CONFIGS)).map((config) => (
            <MoodTag
              key={config.label}
              config={config}
              isSelected={selectedMood === config.label}
              onClick={() => setSelectedMood(config.label)}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isReady}
          className={`
            w-full py-4 rounded-full text-lg font-medium transition-all duration-300
            ${isReady
              ? 'bg-[#18E6C4] text-gray-800 active:scale-[0.98] shadow-sm' 
              : 'bg-[#C9F2EB] text-[#8E9A98] cursor-not-allowed'}
          `}
        >
          先留在这里
        </button>
      </section>

      <section>
        <div className="mb-6 px-1">
          <h3 className="text-xl font-bold text-gray-800">更早</h3>
        </div>
        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((entry) => (
              <HistoryItem key={entry.id} entry={entry} />
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-300 font-light text-sm italic">还没有留下任何感受...</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );

  return (
    <div className="min-h-screen pb-32 w-full max-w-[375px] mx-auto bg-white flex flex-col">
      <StatusBar />
      {activeTab === '此刻' && <Header />}
      
      {activeTab === '此刻' ? renderMomentPage() : null}
      {activeTab === '回顾' ? <ReviewPage history={history} /> : null}
      {activeTab === '轨迹' ? <TrajectoryPage history={history} /> : null}
      {activeTab === '未来' ? <FuturePage letters={futureLetters} onAddLetter={handleAddFutureLetter} /> : null}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;