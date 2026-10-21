import { useCallback, useEffect, useState } from "react";
import { Copy, Ghost, Lock, Moon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { IDLE_TAB_HOURS, KEEP_RECENT_TABS } from "@/config";
import {
  closeTabs,
  ensureTabsPermission,
  getAllTabs,
  getGraveyard,
  pickDuplicateTabs,
  pickExtraTabs,
  pickIdleTabs,
  restoreTabs,
  type GraveEntry,
  type TabInfo,
} from "@/lib/tabs";
import { openUpgradePage } from "@/lib/pro";
import { formatAura } from "@/lib/constants";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Graveyard } from "./Graveyard";

interface CleanupPanelProps {
  tabCount: number;
  isPro: boolean;
  onTabsChanged: () => void;
}

interface PendingCleanup {
  title: string;
  tabs: TabInfo[];
}

export function CleanupPanel({ tabCount, isPro, onTabsChanged }: CleanupPanelProps) {
  const [pending, setPending] = useState<PendingCleanup | null>(null);
  const [graveyard, setGraveyard] = useState<GraveEntry[]>([]);
  const [showGraveyard, setShowGraveyard] = useState(false);

  const loadGraveyard = useCallback(() => {
    getGraveyard().then(setGraveyard);
  }, []);

  useEffect(() => {
    loadGraveyard();
  }, [loadGraveyard]);

  const startCleanup = async (title: string, pick: (tabs: TabInfo[]) => TabInfo[]) => {
    if (!(await ensureTabsPermission())) {
      toast.error("Need tab access to clean up. No access, no aura.");
      return;
    }
    const tabs = pick(await getAllTabs());
    if (tabs.length === 0) {
      toast.success("Nothing to close. Lowkey W.");
      return;
    }
    setPending({ title, tabs });
  };

  const confirmCleanup = async () => {
    if (!pending) return;
    const closed = pending.tabs.length;
    const batchId = await closeTabs(pending.tabs);
    setPending(null);
    onTabsChanged();
    loadGraveyard();
    toast.success(`Yeeted ${closed} tab${closed === 1 ? "" : "s"}. ${formatAura(closed * 100)}`, {
      action: {
        label: "Undo",
        onClick: async () => {
          const batch = (await getGraveyard()).filter((e) => e.batchId === batchId);
          await restoreTabs(batch);
          onTabsChanged();
          loadGraveyard();
        },
      },
    });
  };

  const proAction = (title: string, pick: (tabs: TabInfo[]) => TabInfo[]) => () =>
    isPro ? startCleanup(title, pick) : openUpgradePage();

  return (
    <div className="space-y-2">
      {tabCount > KEEP_RECENT_TABS && (
        <Button
          onClick={() =>
            startCleanup(`Close extra tabs (keep ${KEEP_RECENT_TABS})?`, (tabs) =>
              pickExtraTabs(tabs, KEEP_RECENT_TABS)
            )
          }
          variant="destructive"
          size="sm"
          className="w-full gap-2"
        >
          <Trash2 size={14} />
          Touch grass: keep {KEEP_RECENT_TABS} newest tabs
        </Button>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={proAction("Close duplicate tabs?", pickDuplicateTabs)}
          variant="secondary"
          size="sm"
          className="gap-1.5 text-xs"
        >
          {isPro ? <Copy size={12} /> : <Lock size={12} />}
          Kill dupes
        </Button>
        <Button
          onClick={proAction(`Close tabs idle ${IDLE_TAB_HOURS}h+?`, (tabs) =>
            pickIdleTabs(tabs, IDLE_TAB_HOURS)
          )}
          variant="secondary"
          size="sm"
          className="gap-1.5 text-xs"
        >
          {isPro ? <Moon size={12} /> : <Lock size={12} />}
          Idle {IDLE_TAB_HOURS}h+
        </Button>
      </div>

      {graveyard.length > 0 && (
        <Button
          onClick={() => setShowGraveyard((v) => !v)}
          variant="ghost"
          size="sm"
          className="w-full gap-2 text-xs text-muted-foreground"
        >
          <Ghost size={12} />
          {showGraveyard ? "Hide" : "Open"} tab graveyard
        </Button>
      )}

      {showGraveyard && (
        <Graveyard
          entries={graveyard}
          isPro={isPro}
          onChanged={() => {
            loadGraveyard();
            onTabsChanged();
          }}
        />
      )}

      <AlertDialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent className="w-[90vw] max-w-xs">
          <AlertDialogHeader>
            <AlertDialogTitle>{pending?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.tabs.length} tab{pending?.tabs.length === 1 ? "" : "s"} will be yeeted.
              Pinned, playing and current tabs are safe. You can undo or restore them from the
              graveyard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Nah</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCleanup}>Yeet them</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
