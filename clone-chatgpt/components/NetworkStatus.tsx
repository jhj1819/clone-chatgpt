'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import useNetworkStatus from '@/hooks/useNetworkStatus';

export default function NetworkStatus() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [visible, setVisible] = useState(false);

  // 네트워크 상태 변경 시 알림 표시
  useEffect(() => {
    if (!isOnline || wasOffline) {
      setVisible(true);
      const timer = setTimeout(() => {
        if (isOnline) {
          setVisible(false);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center rounded-md px-4 py-3 shadow-lg ${
          isOnline
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="mr-2 h-5 w-5" />
            <span>네트워크 연결이 복구되었습니다</span>
          </>
        ) : (
          <>
            <WifiOff className="mr-2 h-5 w-5" />
            <span>네트워크 연결이 끊겼습니다</span>
          </>
        )}
        <button
          className="ml-4 rounded-md bg-white bg-opacity-30 px-1 py-1 text-xs hover:bg-opacity-50"
          onClick={() => setVisible(false)}
        >
          닫기
        </button>
      </div>
    </div>
  );
} 