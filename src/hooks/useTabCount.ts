import { useState, useEffect, useCallback } from "react";
import { getAllTabs, isExtension } from "@/lib/tabs";

export function useTabCount() {
  const [tabCount, setTabCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateTabCount = useCallback(async () => {
    const tabs = await getAllTabs();
    setTabCount(tabs.length);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    updateTabCount();

    if (!isExtension) return;
    const handleTabChange = () => {
      updateTabCount();
    };
    chrome.tabs.onCreated.addListener(handleTabChange);
    chrome.tabs.onRemoved.addListener(handleTabChange);
    return () => {
      chrome.tabs.onCreated.removeListener(handleTabChange);
      chrome.tabs.onRemoved.removeListener(handleTabChange);
    };
  }, [updateTabCount]);

  return { tabCount, isLoading, refresh: updateTabCount };
}
