import { RotateCcw } from "lucide-react";
import { GRAVEYARD_LIMIT } from "@/config";
import { clearGraveyard, restoreTabs, type GraveEntry } from "@/lib/tabs";
import { openUpgradePage } from "@/lib/pro";

interface GraveyardProps {
  entries: GraveEntry[];
  isPro: boolean;
  onChanged: () => void;
}

// Free users can bring back their latest cleanup; Pro keeps the full history.
export function Graveyard({ entries, isPro, onChanged }: GraveyardProps) {
  const latestBatch = entries[0]?.batchId;
  const visible = isPro ? entries : entries.filter((e) => e.batchId === latestBatch);
  const hiddenCount = entries.length - visible.length;

  const restore = async (list: GraveEntry[]) => {
    await restoreTabs(list);
    onChanged();
  };

  return (
    <div className="space-y-1.5 rounded-lg border border-border bg-secondary/30 p-2">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>🪦 Tab graveyard</span>
        <div className="flex gap-2">
          <button className="hover:text-foreground" onClick={() => restore(visible)}>
            Restore all
          </button>
          {isPro && (
            <button
              className="hover:text-foreground"
              onClick={async () => {
                await clearGraveyard();
                onChanged();
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <ul className="max-h-36 space-y-1 overflow-y-auto pr-1">
        {visible.map((entry) => (
          <li key={entry.id} className="flex items-center gap-2 text-xs">
            <span className="flex-1 truncate text-foreground/80" title={entry.url}>
              {entry.title}
            </span>
            <button
              onClick={() => restore([entry])}
              className="shrink-0 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Resurrect tab"
            >
              <RotateCcw size={11} />
            </button>
          </li>
        ))}
      </ul>

      {!isPro && hiddenCount > 0 && (
        <button
          onClick={openUpgradePage}
          className="w-full text-[10px] text-primary hover:underline"
        >
          🔒 {hiddenCount} older tab{hiddenCount === 1 ? "" : "s"} buried. Pro remembers your
          last {GRAVEYARD_LIMIT}.
        </button>
      )}
    </div>
  );
}
