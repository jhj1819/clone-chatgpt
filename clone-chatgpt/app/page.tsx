'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useCustomChat } from '@/hooks/useCustomChat';
import ErrorDisplay from '@/components/ErrorDisplay';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';
import Sidebar from '@/components/Sidebar';
import NetworkStatus from '@/components/NetworkStatus';

export default function Home() {
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const chatInitializedRef = useRef(false);
  
  // 커스텀 채팅 훅 사용
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    chatHistory,
    isHistoryLoading,
    createNewChat,
    loadChat,
    deleteChat
  } = useCustomChat({
    id: activeChatId,
    onError: (err) => {
      console.error('Chat API 에러:', err);
    }
  });

  // 새 채팅 처리 - useCallback으로 최적화
  const handleNewChat = useCallback(() => {
    try {
      const newChatId = createNewChat();
      setActiveChatId(newChatId);
    } catch (error) {
      console.error('새 채팅 생성 오류:', error);
    }
  }, [createNewChat]);

  // 채팅 선택 처리 - useCallback으로 최적화
  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
    loadChat(chatId);
  }, [loadChat]);

  // 채팅 삭제 처리 - useCallback으로 최적화
  const handleDeleteChat = useCallback((chatId: string) => {
    deleteChat(chatId);
    
    // 현재 활성화된 채팅이 삭제되는 경우
    if (activeChatId === chatId) {
      const remainingChats = chatHistory.filter(chat => chat.id !== chatId);
      
      if (remainingChats.length > 0) {
        // 다른 채팅으로 전환
        const nextChatId = remainingChats[0].id;
        setActiveChatId(nextChatId);
        loadChat(nextChatId);
      } else {
        // 남은 채팅이 없으면 새 채팅 생성
        handleNewChat();
      }
    }
  }, [activeChatId, chatHistory, deleteChat, handleNewChat, loadChat]);

  // 컴포넌트 마운트 시 채팅 초기화 (한 번만 실행)
  useEffect(() => {
    if (chatInitializedRef.current || isHistoryLoading) return;
    
    if (!isHistoryLoading && chatHistory && !activeChatId) {
      // 채팅 히스토리 초기화
      const initializeChat = () => {
        try {
          if (chatHistory.length === 0) {
            const newChatId = createNewChat();
            setActiveChatId(newChatId);
          } else if (chatHistory.length > 0) {
            // 첫 번째 채팅 선택
            const firstChatId = chatHistory[0].id;
            setActiveChatId(firstChatId);
            loadChat(firstChatId);
          }
          chatInitializedRef.current = true;
        } catch (error) {
          console.error('채팅 초기화 오류:', error);
          // 오류 발생 시 새 채팅 생성
          const newChatId = createNewChat();
          setActiveChatId(newChatId);
          chatInitializedRef.current = true;
        }
      };

      initializeChat();
    }
  }, [isHistoryLoading, chatHistory, activeChatId, createNewChat, loadChat]);

  // 다크모드 초기 설정
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <Sidebar
        chatHistory={chatHistory}
        isHistoryLoading={isHistoryLoading}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex flex-1 flex-col bg-white text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100">
        <main className="flex-1 overflow-hidden">
          <div className="mx-auto h-full max-w-4xl p-4 md:pl-8">
            {/* 에러 발생 시 표시 */}
            {error && (
              <ErrorDisplay
                message="메시지 전송 중 오류가 발생했습니다."
                onRetry={reload}
              />
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

      {/* 네트워크 상태 알림 */}
      <NetworkStatus />
    </div>
  );
}
