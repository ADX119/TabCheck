import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useTabCount } from "@/hooks/useTabCount";
import { getShameLevel, getRandomMessage } from "@/lib/constants";
import { TabCounter } from "./TabCounter";
import { ShameMeter } from "./ShameMeter";
import { ShameMessage } from "./ShameMessage";
import { PerformanceImpact } from "./PerformanceImpact";

export function ShameCard() {
  const { tabCount, isLoading, refresh } = useTabCount();
  const [message, setMessage] = useState("");

  const shameLevel = getShameLevel(tabCount);

  // Update message when tab count changes
  useEffect(() => {
    if (!isLoading) {
      setMessage(getRandomMessage(shameLevel));
    }
  }, [tabCount, shameLevel, isLoading]);

  if (isLoading) {
    return (
      <div className="w-80 p-6 bg-card rounded-2xl border border-border shadow-2xl">
        <div className="flex items-center justify-center h-48">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-8 h-8 text-muted-foreground" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-80 p-4 bg-card rounded-2xl border border-border shadow-2xl space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xs font-bold uppercase tracking-widest text-foreground">
          Tab Shame Meter
        </h1>
        <button
          onClick={refresh}
          className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          title="Refresh count"
        >
          <RefreshCw size={12} className="text-muted-foreground" />
        </button>
      </div>

      {/* Tab Count Display */}
      <TabCounter count={tabCount} shameLevel={shameLevel} />

      {/* Shame Meter */}
      <ShameMeter tabCount={tabCount} shameLevel={shameLevel} />

      {/* Sarcastic Message */}
      <ShameMessage message={message} shameLevel={shameLevel} />

      {/* Performance Impact */}
      <PerformanceImpact shameLevel={shameLevel} />
    </motion.div>
  );
}