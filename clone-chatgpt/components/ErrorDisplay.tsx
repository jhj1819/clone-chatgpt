import React from 'react';
import { XCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <XCircle className="h-5 w-5 text-red-400 dark:text-red-300" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            오류가 발생했습니다
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="rounded-md bg-red-200 px-3 py-1 text-sm font-medium text-red-800 hover:bg-red-300 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
              >
                다시 시도
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 