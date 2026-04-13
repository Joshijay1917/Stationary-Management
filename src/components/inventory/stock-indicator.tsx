import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StockIndicatorProps {
  stock: number;
}

export function StockIndicator({ stock }: StockIndicatorProps) {
  if (stock < 10) {
    return (
      <Badge variant="destructive" className="gap-1 px-2 py-0.5">
        <AlertCircle className="w-3.5 h-3.5" />
        Low Stock
      </Badge>
    );
  }

  if (stock <= 20) {
    return (
      <Badge
        variant="outline"
        className="gap-1 px-2 py-0.5 bg-yellow-500/15 text-yellow-600 dark:text-yellow-500 border-yellow-500/30"
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        Reorder Soon
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1 px-2 py-0.5 bg-green-500/15 text-green-600 dark:text-green-500 border-green-500/30 font-normal"
    >
      <CheckCircle2 className="w-3.5 h-3.5" />
      Healthy
    </Badge>
  );
}
