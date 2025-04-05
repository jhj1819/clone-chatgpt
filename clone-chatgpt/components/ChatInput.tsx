import { FC, FormEvent, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const ChatInput: FC<ChatInputProps> = ({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}) => {
  // 엔터 키로 메시지 전송 (Shift+Enter는 줄바꿈)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form && input.trim()) {
        form.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true })
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex w-full items-center space-x-2 rounded-lg border p-2 shadow-sm dark:border-gray-700"
    >
      <textarea
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        className="flex-1 resize-none overflow-hidden bg-transparent px-2 py-2 focus:outline-none"
        rows={1}
        disabled={isLoading}
        style={{ maxHeight: '200px' }}
      />
      <Button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="shrink-0"
        size="sm"
      >
        <PaperPlaneIcon className="mr-1 h-4 w-4" />
        전송
      </Button>
    </form>
  );
};

export default ChatInput; 