import { useState, useEffect, useCallback } from 'react';

export const useTheme = (): [string, () => void] => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme');
        const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return storedTheme || (userPrefersDark ? 'dark' : 'light');
    }
    return 'light';
  });

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, toggleTheme];
};
