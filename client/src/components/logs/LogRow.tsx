
import type { LogEntry } from "../../types/log";
import Badge from "../common/Badge";

interface LogRowProps {
  log: LogEntry;
  onClick: () => void;
  isNew?: boolean;
}

export default function LogRow({ log, onClick, isNew = false }: LogRowProps) {
  const logTime = log.timestamp ?? log.createdAt;
  const parsedTime = logTime ? new Date(logTime) : null;

  const formattedTime =
    parsedTime && !Number.isNaN(parsedTime.getTime())
      ? parsedTime.toLocaleTimeString()
      : "Unknown time";

  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer border-b border-slate-900 text-sm transition hover:bg-slate-900/60 ${
        isNew ? "animate-[flash_1.2s_ease-out]" : ""
      }`}
    >
      <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">
        {formattedTime}
      </td>
      <td className="px-4 py-2.5 text-slate-300">{log.service}</td>
      <td className="px-4 py-2.5">
        <Badge level={log.level} />
      </td>
      <td className="px-4 py-2.5 font-mono text-xs text-slate-300">
        {log.message}
      </td>
    </tr>
  );
}
