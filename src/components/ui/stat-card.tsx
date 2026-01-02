import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'accent' | 'success' | 'warning';
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = 'default',
  className 
}: StatCardProps) {
  const variants = {
    default: "bg-card border-border/50",
    accent: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-transparent",
    success: "bg-gradient-to-br from-success to-success/80 text-success-foreground border-transparent",
    warning: "bg-gradient-to-br from-warning to-warning/80 text-warning-foreground border-transparent"
  };

  const iconVariants = {
    default: "bg-muted text-muted-foreground",
    accent: "bg-white/20 text-primary-foreground",
    success: "bg-white/20 text-success-foreground",
    warning: "bg-white/20 text-warning-foreground"
  };

  return (
    <div className={cn(
      "rounded-xl border p-6 shadow-sm transition-all hover:shadow-md",
      variants[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn(
            "text-sm font-medium",
            variant === 'default' ? "text-muted-foreground" : "text-inherit opacity-80"
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs",
              variant === 'default' ? "text-muted-foreground" : "text-inherit opacity-70"
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={cn(
          "rounded-lg p-3",
          iconVariants[variant]
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
