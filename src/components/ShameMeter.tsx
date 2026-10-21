import { motion } from "framer-motion";
import { getShamePercentage, SHAME_LEVELS, type ShameLevel } from "@/lib/constants";

interface ShameMeterProps {
  tabCount: number;
  shameLevel: ShameLevel;
}

export function ShameMeter({ tabCount, shameLevel }: ShameMeterProps) {
  const percentage = getShamePercentage(tabCount);
  const config = SHAME_LEVELS[shameLevel];

  // Determine color based on shame level
  const getColorClass = () => {
    switch (shameLevel) {
      case "HEALTHY":
        return "bg-shame-healthy";
      case "RISKY":
        return "bg-shame-risky";
      case "DECLINING":
        return "bg-shame-declining";
      case "CRYING":
        return "bg-shame-crying";
      case "HELP":
        return "bg-shame-help";
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Meter Label */}
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="text-muted-foreground">Brainrot Level</span>
        <motion.span
          key={config.label}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-semibold ${config.glowClass}`}
          style={{
            color: `hsl(var(--${config.color}))`,
          }}
        >
          {config.label} {config.emoji}
        </motion.span>
      </div>

      {/* Progress Bar Track */}
      <div className="relative h-5 bg-secondary rounded-full overflow-hidden border border-border">
        {/* Animated Fill */}
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${getColorClass()} ${config.bgGlowClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 1,
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.2,
          }}
        >
          {/* Inner shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 to-transparent" />
        </motion.div>

        {/* Percentage markers */}
        <div className="absolute inset-0 flex items-center">
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="absolute h-full w-px bg-foreground/10"
              style={{ left: `${mark}%` }}
            />
          ))}
        </div>
      </div>

      {/* Scale Labels */}
      <div className="flex justify-between text-xs text-muted-foreground/70">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100+</span>
      </div>
    </div>
  );
}