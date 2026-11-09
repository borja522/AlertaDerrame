import { useState, useCallback } from 'react';
import { 
  getSoundMuted, 
  setSoundMuted, 
  playEmergencySirenSound, 
  playSuccessChime, 
  playInfoBeep 
} from '../utils/audio';

export interface UseSoundAlertsReturn {
  isMuted: boolean;
  toggleMute: () => void;
  playSiren: () => void;
  playSuccess: () => void;
  playBeep: () => void;
}

export function useSoundAlerts(): UseSoundAlertsReturn {
  const [isMuted, setIsMuted] = useState<boolean>(() => getSoundMuted());

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      setSoundMuted(next);
      return next;
    });
  }, []);

  const playSiren = useCallback(() => {
    playEmergencySirenSound();
  }, []);

  const playSuccess = useCallback(() => {
    playSuccessChime();
  }, []);

  const playBeep = useCallback(() => {
    playInfoBeep();
  }, []);

  return {
    isMuted,
    toggleMute,
    playSiren,
    playSuccess,
    playBeep,
  };
}

