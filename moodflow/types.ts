export type MoodType = '平静' | '低落' | '混乱' | '高兴';

export interface MoodEntry {
  id: string;
  content: string;
  mood: MoodType;
  timestamp: Date;
}

export interface MoodConfig {
  label: MoodType;
  emoji: string;
  color: string;
  bgColor: string;
}

export type FutureDuration = '一周后' | '一个月后' | '三个月后';

export interface FutureLetter {
  id: string;
  content: string;
  duration: FutureDuration;
  timestamp: Date;
}