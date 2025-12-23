import { motion } from "framer-motion";
import { SHAME_LEVELS, type getShameLevel } from "@/lib/constants";

interface ShameMessageProps {
  message: string;
  shameLevel: ReturnType<typeof getShameLevel>;
}

export function ShameMessage({ message, shameLevel }: ShameMessageProps) {
  const config = SHAME_LEVELS[shameLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="relative"
    >
      <motion.p
        key={message}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-medium text-center px-3 py-2 bg-secondary/50 rounded-lg border border-border italic"
        style={{
          color: `hsl(var(--${config.color}))`,
        }}
      >
        "{message}"
      </motion.p>
    </motion.div>
  );
}