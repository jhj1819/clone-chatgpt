import { FC } from 'react';
import ThemeToggle from './ThemeToggle';

const Header: FC = () => {
  return (
    <header className="sticky top-0 z-10 border-b bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">AI 채팅 어시스턴트</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header; 