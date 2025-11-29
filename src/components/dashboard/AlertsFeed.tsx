import { AlertTriangle, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

interface AlertsFeedProps {
  alerts: Alert[];
  className?: string;
  maxItems?: number;
}

const severityConfig = {
  red: {
    icon: AlertTriangle,
    badge: "alert-red",
    label: "Critical",
  },
  orange: {
    icon: AlertCircle,
    badge: "alert-orange",
    label: "Warning",
  },
  green: {
    icon: CheckCircle,
    badge: "alert-green",
    label: "Success",
  },
} as const;

export function AlertsFeed({ alerts, className, maxItems = 5 }: AlertsFeedProps) {
  const displayedAlerts = alerts.slice(0, maxItems);

  return (
    <div className={cn("bg-card rounded-lg border border-border", className)}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="font-semibold text-foreground">Alerts & Notifications</h3>
        <span className="text-xs text-muted-foreground">{alerts.length} total</span>
      </div>

      <div className="divide-y divide-border">
        {displayedAlerts.length === 0 ? (
          <div className="px-5 py-8 text-center text-muted-foreground">
            No alerts at this time
          </div>
        ) : (
          displayedAlerts.map((alert, index) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className="px-5 py-4 hover:bg-muted/50 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      alert.severity === "red" &&
                        "bg-destructive/10 text-destructive",
                      alert.severity === "orange" &&
                        "bg-warning/10 text-warning",
                      alert.severity === "green" &&
                        "bg-success/10 text-success"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("alert-badge", config.badge)}>
                        {config.label}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(alert.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {alerts.length > maxItems && (
        <div className="border-t border-border px-5 py-3">
          <button className="text-sm text-primary hover:text-primary/80 font-medium">
            View all {alerts.length} alerts →
          </button>
        </div>
      )}
    </div>
  );
}

// 👉 Extra safety: default export bhi de dete hain
export default AlertsFeed;
