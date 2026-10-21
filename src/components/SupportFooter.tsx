import { useState } from "react";
import { Crown, Heart, KeyRound, Wallet } from "lucide-react";
import { toast } from "sonner";
import { DONATION_URL, PRO_PRICE_LABEL, SOLANA_TIP_ADDRESS } from "@/config";
import { activateLicense, canUpgrade, openUpgradePage, removeLicense } from "@/lib/pro";
import { Button } from "./ui/button";

interface SupportFooterProps {
  isPro: boolean;
}

export function SupportFooter({ isPro }: SupportFooterProps) {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [activating, setActivating] = useState(false);

  const handleActivate = async () => {
    setActivating(true);
    const error = await activateLicense(licenseKey);
    setActivating(false);
    if (error) {
      toast.error(error);
      return;
    }
    setLicenseKey("");
    setShowKeyInput(false);
    toast.success("Pro unlocked. Infinite aura. 👑");
  };

  const copySolanaAddress = async () => {
    await navigator.clipboard.writeText(SOLANA_TIP_ADDRESS);
    toast.success("Solana address copied. Paste it in Phantom. 🙏");
  };

  return (
    <div className="space-y-2 border-t border-border pt-3">
      {isPro ? (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-primary">👑 Pro unlocked. Infinite aura.</span>
          <button
            onClick={removeLicense}
            className="text-[10px] text-muted-foreground/60 hover:text-foreground"
            title="Remove the license from this browser so you can use it elsewhere"
          >
            Remove key
          </button>
        </div>
      ) : (
        canUpgrade && (
          <>
            <Button onClick={openUpgradePage} size="sm" className="w-full gap-2">
              <Crown size={14} />
              Go Pro: {PRO_PRICE_LABEL}
            </Button>

            {showKeyInput ? (
              <div className="flex gap-1.5">
                <input
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleActivate()}
                  placeholder="Paste license key"
                  className="min-w-0 flex-1 rounded-md border border-border bg-secondary px-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
                <Button onClick={handleActivate} disabled={activating} size="sm" variant="secondary">
                  {activating ? "..." : "Activate"}
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setShowKeyInput(true)}
                className="flex w-full items-center justify-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <KeyRound size={11} />
                Already paid? Enter your license key
              </button>
            )}
          </>
        )
      )}

      {(DONATION_URL || SOLANA_TIP_ADDRESS) && (
        <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
          {DONATION_URL && (
            <a
              href={DONATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
              title="Yes, it opens a tab"
            >
              <Heart size={11} className="text-shame-crying" />
              Fund my brainrot rehab
            </a>
          )}
          {SOLANA_TIP_ADDRESS && (
            <button onClick={copySolanaAddress} className="flex items-center gap-1 hover:text-foreground">
              <Wallet size={11} className="text-primary" />
              Tip in SOL
            </button>
          )}
        </div>
      )}
    </div>
  );
}
