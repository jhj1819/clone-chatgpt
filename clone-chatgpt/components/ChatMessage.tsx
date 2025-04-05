import { Message } from 'ai/react';
import { cn } from '@/lib/utils';
import { FC } from 'react';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

const ChatMessage: FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full items-start gap-2 py-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex max-w-[80%] flex-col rounded-lg px-4 py-2',
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
        )}
      >
        <div className="text-sm font-semibold">
          {isUser ? '사용자' : 'AI 어시스턴트'}
        </div>
        
        <div className="mt-1 whitespace-pre-wrap">{message.content}</div>
        
        {isLoading && (
          <div className="mt-2 flex items-center">
            <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-60"></div>
            <div className="mx-0.5 h-2 w-2 animate-bounce rounded-full bg-current opacity-60 delay-75"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-60 delay-150"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 