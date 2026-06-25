import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Status } from "@/app/generated/prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // 1. Get id from params and parse id to int
  const { id } = await params;
  const numericId = parseInt(id);

  const { status, notes } = await request.json();

  const VALID_STATUSES = Object.values(Status) as string[];

  // 2. Handle special cases
  if (status == undefined && notes === undefined) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const job = await db.job.update({
      where: { id: numericId },
      data: {
        ...(status !== undefined && { status: status as Status }),
        ...(notes !== undefined && { notes }),
      },
    });
    return NextResponse.json(job);
  } catch (err) {
    if (typeof err === "object" && err !== null) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    throw err;
  }
}
