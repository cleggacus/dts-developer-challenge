import { db } from "@/db";
import { task } from "@/db/schema";
import { updateTaskSchema } from "@/schemas/tasks";
import { InferResponseType } from "@/types/helpers";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { id, due, ...rest } = parsed.data;

    const updates = {
      ...rest,
      due: new Date(due ?? ""),
    };

    const result = await db
      .update(task)
      .set({ ...updates })
      .where(eq(task.id, id))
      .returning();

    if (result[0]) {
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

export type UpdateTaskResponse = InferResponseType<typeof PUT>;
