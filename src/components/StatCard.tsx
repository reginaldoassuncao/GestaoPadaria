import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({ label, value, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl border border-bakery-100 shadow-sm flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBg)}>
        <Icon className={cn("w-6 h-6", iconColor)} />
      </div>
      <div>
        <p className="text-sm text-bakery-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-bakery-900">{value}</p>
      </div>
    </div>
  );
}
