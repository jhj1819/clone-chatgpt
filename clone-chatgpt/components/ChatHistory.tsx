import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { ChatHistoryItem } from '@/hooks/useCustomChat';

interface ChatHistoryProps {
  history: ChatHistoryItem[];
  isLoading: boolean;
  activeChat?: string;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
}

export default function ChatHistory({
  history,
  isLoading,
  activeChat,
  onSelectChat,
  onDeleteChat,
  onNewChat
}: ChatHistoryProps) {
  // 날짜 포맷팅 함수
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          <span>새 채팅</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-auto px-3 py-2">
        <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          대화 기록
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-500"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            대화 기록이 없습니다
          </div>
        ) : (
          <ul className="space-y-1">
            {history.map((chat) => (
              <li key={chat.id} className="relative">
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm ${
                    activeChat === chat.id
                      ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate font-medium">{chat.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(chat.updatedAt)}
                    </div>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
                  aria-label="대화 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 