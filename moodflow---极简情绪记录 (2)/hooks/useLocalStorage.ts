import { useState, useEffect } from 'react';

/**
 * 自定义 Hook：用于持久化存储数据到 localStorage
 * 包含日期恢复逻辑（处理 JSON 序列化丢失 Date 类型的问题）
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. 初始化时从 localStorage 获取数据
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      // 使用自定义解析器，将符合 ISO 日期格式的字符串转回 Date 对象
      return JSON.parse(item, (key, value) => {
        const isDateString = typeof value === 'string' && 
                             /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value);
        return isDateString ? new Date(value) : value;
      });
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. 当 storedValue 改变时，自动写入 localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
