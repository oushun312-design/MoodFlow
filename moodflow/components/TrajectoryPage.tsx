import React, { useState, useMemo } from 'react';
import { MoodEntry, MoodType } from '../types';

interface TrajectoryPageProps {
  history: MoodEntry[];
}

const moodValues: Record<MoodType, number> = {
  '高兴': 3,
  '平静': 2,
  '混乱': 1,
  '低落': 0,
};

const TrajectoryPage: React.FC<TrajectoryPageProps> = ({ history }) => {
  const [days, setDays] = useState<7 | 30>(7);

  // 检查是否有数据
  const hasData = history.length > 0;

  // 根据真实 history 计算最近 N 天的数据
  const chartData = useMemo(() => {
    const now = new Date();
    const result = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() - i);
      const dateStr = targetDate.toDateString();
      
      const dayEntries = history.filter(e => {
        const d = new Date(e.timestamp);
        return d.toDateString() === dateStr;
      });

      if (dayEntries.length > 0) {
        const sum = dayEntries.reduce((acc, curr) => acc + moodValues[curr.mood], 0);
        result.push(sum / dayEntries.length);
      } else {
        result.push(1.5); 
      }
    }
    return result;
  }, [history, days]);

  // 根据趋势自动生成分析文案
  const analysisText = useMemo(() => {
    if (!hasData) return "每一天的感受都值得被看见";
    
    // 提取有记录的真实数据点（排除默认的1.5）
    const realDataPoints = history
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map(e => moodValues[e.mood]);
    
    if (realDataPoints.length < 3) return "每一天的感受都值得被看见";

    const lastFew = realDataPoints.slice(-5);
    const avg = lastFew.reduce((a, b) => a + b, 0) / lastFew.length;
    const start = lastFew[0];
    const end = lastFew[lastFew.length - 1];
    const trend = end - start;

    // 逻辑判定
    if (trend > 0.8) return "最近的情绪在慢慢变好，真为你高兴";
    if (trend < -0.8) return "最近似乎有些疲惫，记得多抱抱自己";
    if (avg >= 2.5) return "这段时间的心情很灿烂，请继续保持这份喜悦";
    if (avg <= 0.8) return "最近情绪有些低迷，这只是暂时的，都会过去";
    
    // 计算波动
    const diffs = [];
    for(let i=1; i<lastFew.length; i++) diffs.push(Math.abs(lastFew[i] - lastFew[i-1]));
    const volatility = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    
    if (volatility > 1.2) return "这段时间的情绪起伏较大，接纳每一个瞬间的自己";
    
    return "情绪很平稳，这也是一种难得的安宁";
  }, [history, hasData]);

  // 生成 SVG 路径
  const generatePath = (data: number[]) => {
    if (data.length === 0) return "";
    const width = 375;
    const height = 150;
    const step = width / (data.length - 1);
    const getY = (val: number) => height - (val / 3) * height;

    let path = `M 0 ${getY(data[0])}`;
    for (let i = 1; i < data.length; i++) {
      const x = i * step;
      const y = getY(data[i]);
      const prevX = (i - 1) * step;
      const prevY = getY(data[i-1]);
      const cp1x = prevX + (x - prevX) / 2;
      const cp2x = prevX + (x - prevX) / 2;
      path += ` C ${cp1x} ${prevY}, ${cp2x} ${y}, ${x} ${y}`;
    }
    return path;
  };

  const pathData = generatePath(chartData);
  const areaPathData = `${pathData} L 375 200 L 0 200 Z`;

  return (
    <main className="flex-1 flex flex-col pt-10 animate-in fade-in duration-500">
      <div className="px-6 mb-12">
        <h1 className="text-[26px] font-bold text-[#333333] tracking-tight leading-tight">
          情绪不是直线，它会起伏
        </h1>
      </div>

      <div className="flex justify-center mb-16">
        <div className="bg-[#f5f5f5] p-1 rounded-full flex items-center w-56">
          <button
            onClick={() => setDays(7)}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
              days === 7 ? 'bg-[#18E6C4] text-gray-800 shadow-sm' : 'text-[#999999]'
            }`}
          >
            7天
          </button>
          <button
            onClick={() => setDays(30)}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
              days === 30 ? 'bg-[#18E6C4] text-gray-800 shadow-sm' : 'text-[#999999]'
            }`}
          >
            30天
          </button>
        </div>
      </div>

      <div className="relative w-full h-[200px] overflow-hidden group">
        {!hasData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center z-10">
            <div className="w-12 h-12 bg-[#f0f0f0] rounded-full mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm font-light">
              开启第一次情绪记录<br/>让轨迹在这里蔓延
            </p>
          </div>
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 375 200" preserveAspectRatio="none" className="animate-in fade-in slide-in-from-bottom-2 duration-1000">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#18E6C4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#18E6C4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPathData} fill="url(#chartGradient)" />
            <path
              d={pathData}
              fill="none"
              stroke="#18E6C4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Dynamic Analysis Text */}
      <div className="mt-12 px-10 text-center min-h-[48px]">
        <p key={analysisText} className="text-[#666666] text-[15px] leading-relaxed font-light animate-in fade-in slide-in-from-bottom-1 duration-700">
          {analysisText}
        </p>
      </div>
    </main>
  );
};

export default TrajectoryPage;