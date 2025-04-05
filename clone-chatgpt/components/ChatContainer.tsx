import { FC, useEffect, useRef } from 'react';
import { Message } from 'ai/react';
import ChatMessage from './ChatMessage';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatContainer: FC<ChatContainerProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가되면 자동으로 스크롤 아래로 이동
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col overflow-y-auto p-4">
      {/* 초기 상태 */}
      {messages.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <h2 className="mb-4 text-2xl font-bold">AI 어시스턴트와 대화를 시작하세요</h2>
          <p className="text-gray-500 dark:text-gray-400">
            질문하고 싶은 내용을 아래 입력창에 입력하세요.
          </p>
        </div>
      )}

      {/* 메시지 목록 */}
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {/* 로딩 메시지 */}
      {isLoading && (
        <ChatMessage
          message={{
            id: 'loading',
            role: 'assistant',
            content: '',
          }}
          isLoading={true}
        />
      )}

      {/* 스크롤 맨 아래 표시기 */}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatContainer; 