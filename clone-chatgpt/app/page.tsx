'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">AI 채팅 애플리케이션</h1>
        
        <div className="flex flex-col space-y-4 mb-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white self-end' 
                  : 'bg-gray-200 dark:bg-gray-700 self-start'
              } max-w-[80%]`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          
          {isLoading && (
            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg self-start max-w-[80%]">
              <p>AI가 응답 중입니다...</p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            className="flex-1 p-2 border rounded"
            value={input}
            onChange={handleInputChange}
            placeholder="메시지를 입력하세요..."
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            전송
          </Button>
        </form>
      </div>
    </main>
  );
}
