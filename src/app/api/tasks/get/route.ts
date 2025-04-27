import { db } from "@/db";
import { task } from "@/db/schema";
import { getTaskSchema } from "@/schemas/tasks";
import { InferResponseType } from "@/types/helpers";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = getTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const result = await db
      .select()
      .from(task)
      .where(eq(task.id, parsed.data.id));

    if (result.length) {
      return NextResponse.json(result[0]);
    }

    return NextResponse.json(
      {
        error: {
          root: ["Cant find task"],
        },
      },
      { status: 404 },
    );
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

export type GetTaskResponse = InferResponseType<typeof POST>;
