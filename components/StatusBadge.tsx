import { Badge } from "@/components/ui/badge";
import type { Status } from "@/lib/statuses";

const config: Record<Status, { label: string; className: string }> = {
  SAVED: {
    label: "SAVED",
    className: "bg-blue-200 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  APPLIED: {
    label: "APPLIED",
    className: "bg-teal-200 text-teal-700 dark:bg-teal-950 dark:text-teal-950",
  },
  INTERVIEW: {
    label: "INTERVIEW",
    className: "bg-sky-200 text-sky-700 dark:bg-sky-950 dark:text-sky-950",
  },
  OFFER: {
    label: "OFFER",
    className:
      "bg-purple-200 text-purple-700 dark:bg-purple-950 dark:text-purple-950",
  },
  REJECTED: {
    label: "REJECTED",
    className: "bg-red-200 text-red-700 dark:bg-red-950 dark:text-red-950",
  },
  WITHDRAWN: {
    label: "WITHDRAWN",
    className:
      "bg-yellow-200 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-950",
  },
};

export const StatusBadge = ({ status }: { status: Status }) => {
  const { label, className } = config[status];
  return (
    <Badge
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </Badge>
  );
};
