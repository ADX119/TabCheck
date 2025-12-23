import { motion, AnimatePresence } from "framer-motion";
import { SHAME_LEVELS, type getShameLevel } from "@/lib/constants";

interface TabCounterProps {
  count: number;
  shameLevel: ReturnType<typeof getShameLevel>;
}

export function TabCounter({ count, shameLevel }: TabCounterProps) {
  const config = SHAME_LEVELS[shameLevel];

  return (
    <div className="text-center space-y-1">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        Open Tabs
      </p>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: -20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className={`font-mono text-6xl font-extrabold tracking-tighter ${config.glowClass}`}
          style={{
            color: `hsl(var(--${config.color}))`,
          }}
        >
          {count}
        </motion.div>
      </AnimatePresence>

      {/* Subtle subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-muted-foreground/60"
      >
        {count === 1 ? "tab" : "tabs"} demanding attention
      </motion.p>
    </div>
  );
}