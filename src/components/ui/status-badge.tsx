import { cn } from "@/lib/utils";

type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'destructive';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  destructive: "bg-destructive/10 text-destructive"
};

export function StatusBadge({ children, variant = 'default', className }: StatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      variantStyles[variant],
      className
    )}>
      {children}
    </span>
  );
}

// Helper function to get variant from status
export function getStatusVariant(status: string): BadgeVariant {
  const statusMap: Record<string, BadgeVariant> = {
    'Completed': 'success',
    'In Progress': 'info',
    'Planning': 'warning',
    'On Hold': 'warning',
    'Delayed': 'destructive',
    'Scheduled': 'default',
    'Active': 'success',
    'On Leave': 'warning',
    'Inactive': 'destructive',
    'Good': 'success',
    'Medium': 'warning',
    'Low': 'destructive'
  };
  return statusMap[status] || 'default';
}
