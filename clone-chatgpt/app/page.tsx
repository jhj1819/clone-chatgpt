'use client';

import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload
  } = useChat({
    api: '/api/chat',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    onError: (err) => {
      console.error('Chat API 에러:', err);
    }
  });

  // 다크모드 초기 설정
  useEffect(() => {
    // localStorage나 시스템 설정에서 다크모드 설정을 가져와 적용
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-4xl p-4">
          {/* 에러 발생 시 표시 */}
          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-4 dark:bg-red-900/20">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  오류가 발생했습니다. 다시 시도해주세요.
                </p>
                <button
                  onClick={() => reload()}
                  className="rounded-md bg-red-200 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-800 dark:text-red-200"
                >
                  재시도
                </button>
              </div>
            </div>
          )}

          {/* 채팅 메시지 표시 영역 */}
          <ChatContainer messages={messages} isLoading={isLoading} />
          
          {/* 채팅 입력 영역 */}
          <div className="sticky bottom-0 bg-white p-4 dark:bg-gray-900">
            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
