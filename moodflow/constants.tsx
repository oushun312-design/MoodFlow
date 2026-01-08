import { MoodConfig, MoodEntry, MoodType } from './types.ts';

export const MOOD_CONFIGS: Record<MoodType, MoodConfig> = {
  '平静': {
    label: '平静',
    emoji: '',
    color: 'text-orange-400',
    bgColor: 'bg-white',
  },
  '低落': {
    label: '低落',
    emoji: '',
    color: 'text-blue-400',
    bgColor: 'bg-white',
  },
  '混乱': {
    label: '混乱',
    emoji: '',
    color: 'text-gray-400',
    bgColor: 'bg-white',
  },
  '高兴': {
    label: '高兴',
    emoji: '',
    color: 'text-green-400',
    bgColor: 'bg-white',
  }
};

// 新用户进入，没有任何数据
export const INITIAL_HISTORY: MoodEntry[] = [];