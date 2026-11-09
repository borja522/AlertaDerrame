import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  offlineSince: Date | null;
  reconnectedAt: Date | null;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    offlineSince: null,
    reconnectedAt: null,
  }));

  const handleOnline = useCallback(() => {
    setStatus((prev) => ({
      isOnline: true,
      offlineSince: prev.offlineSince,
      reconnectedAt: new Date(),
    }));
  }, []);

  const handleOffline = useCallback(() => {
    setStatus({
      isOnline: false,
      offlineSince: new Date(),
      reconnectedAt: null,
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return status;
}

