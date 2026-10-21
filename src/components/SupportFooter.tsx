import { Crown, Heart } from "lucide-react";
import { DONATION_URL, PRO_PRICE_LABEL } from "@/config";
import { openUpgradePage } from "@/lib/pro";
import { Button } from "./ui/button";

interface SupportFooterProps {
  isPro: boolean;
}

export function SupportFooter({ isPro }: SupportFooterProps) {
  return (
    <div className="space-y-2 border-t border-border pt-3">
      {isPro ? (
        <p className="text-center text-xs font-medium text-primary">
          👑 Pro unlocked. Infinite aura.
        </p>
      ) : (
        <Button onClick={openUpgradePage} size="sm" className="w-full gap-2">
          <Crown size={14} />
          Go Pro: {PRO_PRICE_LABEL}
        </Button>
      )}

      {DONATION_URL && (
        <a
          href={DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
        >
          <Heart size={11} className="text-shame-crying" />
          Donate to the dev's brainrot rehab fund
          <span className="text-muted-foreground/50">(yes, it opens a tab)</span>
        </a>
      )}
    </div>
  );
}
