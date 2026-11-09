import { useEffect } from 'react';

export interface ShortcutHandlers {
  onEscape?: () => void;
  onMapView?: () => void;
  onDashboardView?: () => void;
  onProtocolsView?: () => void;
  onFocusSearch?: () => void;
  onToggleMute?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive = 
        activeEl instanceof HTMLInputElement || 
        activeEl instanceof HTMLTextAreaElement || 
        activeEl instanceof HTMLSelectElement ||
        (activeEl instanceof HTMLElement && activeEl.isContentEditable);

      // Escape is always permitted
      if (event.key === 'Escape' && handlers.onEscape) {
        handlers.onEscape();
        return;
      }

      // If user is currently typing inside an input, ignore navigational hotkeys
      if (isInputActive) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'm':
          if (handlers.onMapView) {
            event.preventDefault();
            handlers.onMapView();
          }
          break;
        case 'd':
          if (handlers.onDashboardView) {
            event.preventDefault();
            handlers.onDashboardView();
          }
          break;
        case 'p':
          if (handlers.onProtocolsView) {
            event.preventDefault();
            handlers.onProtocolsView();
          }
          break;
        case '/':
          if (handlers.onFocusSearch) {
            event.preventDefault();
            handlers.onFocusSearch();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
}
