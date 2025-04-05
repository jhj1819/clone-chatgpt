import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean; // 이전에 오프라인이었는지 기록
}

export default function useNetworkStatus(): NetworkStatus {
  // 초기 상태는 서버 사이드 렌더링을 고려하여 설정
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true, // 서버 사이드에서는 기본적으로 온라인으로 간주
    wasOffline: false
  });

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;
    
    // 초기 상태 설정
    setStatus({
      isOnline: navigator.onLine,
      wasOffline: false
    });

    const handleOnline = () => {
      setStatus((prev) => ({
        isOnline: true,
        wasOffline: !prev.isOnline // 현재 상태가 오프라인이면 wasOffline을 true로 설정
      }));
    };

    const handleOffline = () => {
      setStatus({
        isOnline: false,
        wasOffline: false
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
} 