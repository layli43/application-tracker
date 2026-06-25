"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { job } from "@/app/generated/prisma/client";

type SerializedJob = Omit<job, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
import { StatusBadge } from "@/components/StatusBadge";
import { ALL_STATUSES, type Status } from "@/lib/statuses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

export default function JobTable({
  jobs,
  total,
  page,
  pageSize,
}: {
  jobs: SerializedJob[];
  total: number;
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<Record<number, Status>>(
    {},
  );
  const totalPages = Math.ceil(total / pageSize);

  async function patchJob(
    id: number,
    data: { status?: Status; notes?: string },
  ) {
    const res = await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="px-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-65">Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-50">Notes</TableHead>
            <TableHead>Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id} className="hover:bg-muted/40">
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {job.company}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {job.location}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {job.salary ?? "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {job.platform}
              </TableCell>
              <TableCell>
                <Select
                  value={pendingStatus[job.id] ?? job.status}
                  onValueChange={(s) => {
                    setPendingStatus((prev) => ({
                      ...prev,
                      [job.id]: s as Status,
                    }));
                    patchJob(job.id, { status: s as Status });
                  }}
                >
                  <SelectTrigger className="w-36 border-none shadow-none px-0 h-auto">
                    <StatusBadge status={pendingStatus[job.id] ?? job.status} />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        <StatusBadge status={s} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  defaultValue={job.notes ?? ""}
                  className="h-7 text-sm border-transparent hover:border-input focus:border-input transition-colors"
                  placeholder="Add note…"
                  onBlur={(e) => {
                    if (e.target.value !== job.notes) {
                      patchJob(job.id, { notes: e.target.value });
                    }
                  }}
                />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {job.createdAt.slice(0, 10)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${page - 1}`}
              aria-disabled={page <= 1}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
            <PaginationItem key={i}>
              <PaginationLink href={`?page=${i}`} isActive={i == page}>
                {i}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href={`?page=${page + 1}`}
              aria-disabled={page >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
