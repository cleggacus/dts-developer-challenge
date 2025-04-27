import { db } from "@/db";
import { task } from "@/db/schema";
import { createTaskSchema } from "@/schemas/tasks";
import { InferResponseType } from "@/types/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { title, description, status, due } = parsed.data;

    const result = await db
      .insert(task)
      .values({
        title,
        description,
        status,
        due: new Date(due),
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
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

export type CreateTaskResponse = InferResponseType<typeof POST>;
