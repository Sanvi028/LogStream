interface StatsCardProps {
  label: string;
  value: number;
  accent?: "default" | "error" | "warn";
}

const accentStyles = {
  default: "text-slate-100",
  error: "text-red-400",
  warn: "text-amber-400",
};

export default function StatsCard({ label, value, accent = "default" }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-slate-900 bg-slate-900/40 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-1.5 text-2xl font-semibold ${accentStyles[accent]}`}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}