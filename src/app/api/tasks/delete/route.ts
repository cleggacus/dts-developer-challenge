import { db } from "@/db";
import { task } from "@/db/schema";
import { deleteTaskSchema } from "@/schemas/tasks";
import { InferResponseType } from "@/types/helpers";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const parsed = deleteTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const result = await db
    .delete(task)
    .where(eq(task.id, parsed.data.id))
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
}

export type DeleteTaskResponse = InferResponseType<typeof DELETE>;
