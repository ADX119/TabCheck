import { useState, useEffect, useCallback } from "react";

// Chrome API types
declare global {
  interface Window {
    chrome?: {
      tabs?: {
        query: (
          queryInfo: { windowId?: number },
          callback: (tabs: { id?: number }[]) => void
        ) => void;
        onCreated?: {
          addListener: (callback: () => void) => void;
          removeListener: (callback: () => void) => void;
        };
        onRemoved?: {
          addListener: (callback: () => void) => void;
          removeListener: (callback: () => void) => void;
        };
      };
      windows?: {
        WINDOW_ID_NONE: number;
      };
    };
  }
}

export function useTabCount() {
  const [tabCount, setTabCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateTabCount = useCallback(() => {
    // Check if Chrome API is available
    if (typeof window !== "undefined" && window.chrome?.tabs?.query) {
      // Query all tabs across all windows
      window.chrome.tabs.query({}, (tabs) => {
        setTabCount(tabs.length);
        setIsLoading(false);
      });
    } else {
      // Fallback for development/preview (simulate random tab count)
      const simulatedCount = Math.floor(Math.random() * 80) + 5;
      setTabCount(simulatedCount);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial count
    updateTabCount();

    // Set up listeners for tab changes (Chrome extension only)
    if (typeof window !== "undefined" && window.chrome?.tabs) {
      const handleTabChange = () => {
        updateTabCount();
      };

      window.chrome.tabs.onCreated?.addListener(handleTabChange);
      window.chrome.tabs.onRemoved?.addListener(handleTabChange);

      return () => {
        window.chrome.tabs?.onCreated?.removeListener(handleTabChange);
        window.chrome.tabs?.onRemoved?.removeListener(handleTabChange);
      };
    }
  }, [updateTabCount]);

  return { tabCount, isLoading, refresh: updateTabCount };
}