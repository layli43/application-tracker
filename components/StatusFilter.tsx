"use client";
import { useSearchParams } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { ALL_STATUSES, type Status } from "@/lib/statuses";
import Link from "next/link";

export function StatusFilter({ currentStatus }: { currentStatus?: string }) {
  const searchParams = useSearchParams();

  function buildHref(status?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status) params.set("status", status);
    else params.delete("status");
    params.set("page", "1");
    return `?${params.toString()}`;
  }

  return (
    <div className="flex gap-2 px-6 py-3 border-b border-gray-200 flex-wrap">
      <Link
        href={buildHref()}
        className={`text-sm px-3 py-1 rounded-full border ${!currentStatus ? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-600 hover:border-gray-500"}`}
      >
        All
      </Link>
      {ALL_STATUSES.map((s) => (
        <Link
          key={s}
          href={buildHref(s)}
          className={
            currentStatus === s ? "opacity-100" : "opacity-50 hover:opacity-75"
          }
        >
          <StatusBadge status={s as Status} />
        </Link>
      ))}
    </div>
  );
}
