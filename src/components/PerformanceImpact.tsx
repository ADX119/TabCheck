import { motion } from "framer-motion";
import { Cpu, HardDrive, Brain } from "lucide-react";
import { PERFORMANCE_IMPACTS, SHAME_LEVELS, type getShameLevel } from "@/lib/constants";

interface PerformanceImpactProps {
  shameLevel: ReturnType<typeof getShameLevel>;
}

export function PerformanceImpact({ shameLevel }: PerformanceImpactProps) {
  const impact = PERFORMANCE_IMPACTS[shameLevel];
  const config = SHAME_LEVELS[shameLevel];

  const metrics = [
    {
      icon: HardDrive,
      label: "Est. Memory",
      value: impact.memory,
    },
    {
      icon: Brain,
      label: "Focus Impact",
      value: impact.focusImpact,
    },
    {
      icon: Cpu,
      label: "CPU Stress",
      value: impact.cpuStress,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="space-y-2"
    >
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
        Performance Impact
      </h3>

      <div className="grid gap-1.5">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            className="flex items-center gap-2 p-1.5 bg-secondary/30 rounded-lg border border-border/50"
          >
            <div
              className="p-1 rounded"
              style={{
                backgroundColor: `hsl(var(--${config.color}) / 0.15)`,
              }}
            >
              <metric.icon
                size={12}
                style={{
                  color: `hsl(var(--${config.color}))`,
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground leading-none">{metric.label}</p>
              <p className="text-xs font-medium text-foreground truncate leading-tight">
                {metric.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-[9px] text-center text-muted-foreground/50 italic pt-1">
        * Estimates are emotionally accurate, not technically.
      </p>
    </motion.div>
  );
}