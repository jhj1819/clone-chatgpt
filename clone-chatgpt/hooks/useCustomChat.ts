import { useChat as useAIChat, Message } from 'ai/react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export interface ChatHistoryItem {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UseChatOptions {
  initialMessages?: Message[];
  id?: string;
  body?: Record<string, any>;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
  onError?: (error: Error) => void;
  onResponse?: (response: Response) => void | Promise<void>;
  onFinish?: (message: Message) => void;
  onMessageCreated?: (message: Message) => void;
}

// localStorage 안전하게 접근
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('로컬 스토리지 접근 에러:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('로컬 스토리지 저장 에러:', error);
      return false;
    }
  }
};

export function useCustomChat(options: UseChatOptions = {}) {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const prevMessagesRef = useRef<Message[]>([]);
  const prevIdRef = useRef<string | undefined>(options.id);
  
  // AI SDK의 useChat 사용
  const chatHelpers = useAIChat({
    api: '/api/chat',
    id: options.id,
    initialMessages: options.initialMessages || [],
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      ...(options.headers || {})
    } as Record<string, string>,
    body: options.body,
    credentials: options.credentials,
    onError: (error) => {
      console.error('채팅 API 에러:', error);
      if (options.onError) options.onError(error);
    },
    onResponse: options.onResponse,
    onFinish: (message) => {
      // 대화가 완료되면 최신 메시지로 제목 업데이트
      if (options.id) {
        updateChatTitle(options.id, chatHelpers.messages);
      }
      if (options.onFinish) options.onFinish(message);
    },
  });

  const { messages, setMessages } = chatHelpers;

  // 새 채팅 세션 생성
  const createNewChat = useCallback(() => {
    const newChatId = Date.now().toString();
    const newChat: ChatHistoryItem = {
      id: newChatId,
      title: '새 대화',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setChatHistory(prev => [newChat, ...prev]);
    setMessages([]);
    return newChatId;
  }, [setMessages]);

  // 채팅 히스토리 불러오기 (localStorage 사용)
  const loadChatHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const savedHistory = safeLocalStorage.getItem('chatHistory');
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory) as ChatHistoryItem[];
          // 날짜 문자열을 Date 객체로 변환
          const formattedHistory = parsedHistory.map(chat => ({
            ...chat,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt)
          }));
          setChatHistory(formattedHistory);
        } catch (parseError) {
          console.error('채팅 히스토리 파싱 실패:', parseError);
          setChatHistory([]);
        }
      }
    } catch (error) {
      console.error('채팅 히스토리 불러오기 실패:', error);
      setChatHistory([]);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  // 채팅 히스토리 저장
  const saveChatHistory = useCallback(() => {
    if (typeof window === 'undefined') return; // 서버 사이드에서는 실행하지 않음
    
    try {
      const serializedHistory = JSON.stringify(chatHistory);
      safeLocalStorage.setItem('chatHistory', serializedHistory);
    } catch (error) {
      console.error('채팅 히스토리 저장 실패:', error);
    }
  }, [chatHistory]);

  // 채팅 제목 자동 업데이트 (함수 호출 방식으로 변경)
  const updateChatTitle = useCallback((chatId: string, currentMessages: Message[]) => {
    if (currentMessages.length > 1) {
      // 사용자의 첫 메시지를 기준으로 제목 생성
      const firstUserMessage = currentMessages.find(m => m.role === 'user');
      if (firstUserMessage) {
        const title = firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
        setChatHistory(prev => 
          prev.map(chat => 
            chat.id === chatId 
              ? { ...chat, title, messages: currentMessages, updatedAt: new Date() } 
              : chat
          )
        );
      }
    }
  }, []);

  // 특정 채팅 불러오기
  const loadChat = useCallback((chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      return true;
    }
    return false;
  }, [chatHistory, setMessages]);

  // 특정 채팅 삭제
  const deleteChat = useCallback((chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
  }, []);

  // 채팅 히스토리 변경 시 저장
  useEffect(() => {
    if (chatHistory.length > 0) {
      saveChatHistory();
    }
  }, [chatHistory, saveChatHistory]);

  // 컴포넌트 마운트 시 히스토리 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadChatHistory();
    }
  }, [loadChatHistory]);

  // 메시지 변경 시 현재 채팅 업데이트 - 의존성 최적화 및 이전 메시지 비교
  useEffect(() => {
    // 이전 메시지 또는 ID와 비교하여 변경이 있을 때만 실행
    const hasMessagesChanged = 
      messages.length !== prevMessagesRef.current.length ||
      JSON.stringify(messages) !== JSON.stringify(prevMessagesRef.current);
    
    const hasIdChanged = options.id !== prevIdRef.current;

    if (options.id && messages.length > 0 && (hasMessagesChanged || hasIdChanged)) {
      // 현재 메시지와 ID 저장
      prevMessagesRef.current = [...messages];
      prevIdRef.current = options.id;

      // 상태 업데이트 최적화: 현재 채팅만 업데이트
      setChatHistory(prev => {
        const chatExists = prev.some(chat => chat.id === options.id);
        
        if (chatExists) {
          return prev.map(chat => 
            chat.id === options.id 
              ? { ...chat, messages: [...messages], updatedAt: new Date() } 
              : chat
          );
        }
        
        // 채팅이 존재하지 않으면 새로 추가 (이 부분은 일반적으로 실행되지 않아야 함)
        return prev;
      });
    }
  }, [messages, options.id]);

  return {
    ...chatHelpers,
    chatHistory,
    isHistoryLoading,
    createNewChat,
    loadChat,
    deleteChat,
    loadChatHistory
  };
} 