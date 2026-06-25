import { db } from "@/lib/db";
import JobTable from "../components/JobTable";
import { SearchInput } from "@/components/SearchInput";
import { StatusFilter } from "@/components/StatusFilter";

const PAGE_SIZE = 20;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const { page, search, status } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1"));

  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { company: { contains: search, mode: "insensitive" as const } },
        { location: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(status && {
      status: status as import("@/app/generated/prisma/client").Status,
    }),
  };

  const [rawJobs, total] = await Promise.all([
    db.job.findMany({
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      where,
    }),
    db.job.count({ where }),
  ]);

  const jobs = rawJobs.map((job) => ({
    ...job,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  }));

  return (
    <main>
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Application Tracker
        </h1>
        <SearchInput defaultValue={search ?? ""} />
      </div>
      <StatusFilter currentStatus={status} />
      <JobTable
        jobs={jobs}
        total={total}
        page={currentPage}
        pageSize={PAGE_SIZE}
      />
    </main>
  );
}
