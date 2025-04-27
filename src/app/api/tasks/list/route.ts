import { db } from "@/db";
import { task } from "@/db/schema";
import { InferResponseType } from "@/types/helpers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tasks = await db.select().from(task);
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json(
      {
        error: {
          root: ["Server error"],
        },
      },
      { status: 500 },
    );
  }
}

export type ListTaskResponse = InferResponseType<typeof GET>;
