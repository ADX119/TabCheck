import { useEffect, useState } from "react";
import { isProUser, onProUnlocked } from "@/lib/pro";

export function usePro() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    isProUser().then(setIsPro);
    onProUnlocked(() => setIsPro(true));
  }, []);

  return isPro;
}
