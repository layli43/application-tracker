import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { job } from "@/app/generated/prisma/client";
import { Status } from "@/app/generated/prisma/client";

// A standard api
// 1. Validation
// 2. Data parsing
// 3. Actions
// 4. Return response
export async function POST(request: NextRequest) {
  //1. Check auth
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.API_SECRET}`) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  //2. Parse body
  const { jobs } = await request.json();

  //3. Insert into the database
  const results = await Promise.all(
    jobs.map((job: job) => {
      const { title, company, location, workplace_type, salary, platform } =
        job;
      db.job.upsert({
        where: { title_company: { title: title, company: company } },
        update: {},
        create: { title, company, location, workplace_type, salary, platform },
      });
    }),
  );

  // Return response
  return NextResponse.json({ inserted: results.length }, { status: 200 });
}

// Query jobs list by fetching data
export async function GET(request: NextRequest) {
  // 1. Extract searchParam
  const { searchParams } = new URL(request.url);
  // 2. Use db object query from database
  const dateFrom = searchParams.get("createdAt");
  const data = await db.job.findMany({
    where: {
      id: Number(searchParams.get("id")) ?? undefined,
      title: searchParams.get("title") ?? undefined,
      company: searchParams.get("company") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      createdAt: dateFrom ? { gte: new Date(dateFrom) } : undefined,
      status: (searchParams.get("status") as Status) ?? undefined,
    },
  });
  // 3. Return data
  return NextResponse.json({ data });
}
