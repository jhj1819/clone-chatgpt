import { FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

const ThemeToggle: FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 시스템 테마 감지 및 초기 설정
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDarkMode ? 'dark' : 'light');
    
    // 현재 테마 적용
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  // 테마 전환
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
      aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ThemeToggle; 