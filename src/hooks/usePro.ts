import { useEffect, useState } from "react";
import { isProUser, onLicenseChanged } from "@/lib/pro";

export function usePro() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const check = () => {
      isProUser().then(setIsPro);
    };
    check();
    return onLicenseChanged(check);
  }, []);

  return isPro;
}
