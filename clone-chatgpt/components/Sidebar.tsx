import React, { useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import ChatHistory from './ChatHistory';
import ThemeToggle from './ThemeToggle';
import { ChatHistoryItem } from '@/hooks/useCustomChat';

interface SidebarProps {
  chatHistory: ChatHistoryItem[];
  isHistoryLoading: boolean;
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
}

export default function Sidebar({
  chatHistory,
  isHistoryLoading,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 모바일 토글 버튼 */}
      <button
        type="button"
        className="fixed left-4 top-4 z-20 rounded-md p-2 text-gray-400 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? '사이드바 닫기' : '사이드바 열기'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* 사이드바 오버레이 - 모바일에서만 표시 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 w-64 transform bg-white shadow-lg transition-transform dark:bg-gray-800 md:static md:z-0 md:translate-x-0 md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
            <h1 className="text-lg font-bold">AI 채팅</h1>
            <ThemeToggle />
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatHistory
              history={chatHistory}
              isLoading={isHistoryLoading}
              activeChat={activeChatId}
              onSelectChat={(chatId) => {
                onSelectChat(chatId);
                setIsOpen(false); // 모바일에서 채팅 선택 시 사이드바 닫기
              }}
              onDeleteChat={onDeleteChat}
              onNewChat={() => {
                onNewChat();
                setIsOpen(false); // 모바일에서 새 채팅 생성 시 사이드바 닫기
              }}
            />
          </div>

          <div className="border-t p-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            © 2025 AI 채팅 앱
          </div>
        </div>
      </aside>
    </>
  );
} 