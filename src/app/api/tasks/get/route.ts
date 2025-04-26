import { db } from '@/db';
import { task } from '@/db/schema';
import { getTaskSchema } from '@/schemas/tasks';
import { InferResponseType } from '@/types/helpers';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = getTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const result = await db.select().from(task).where(eq(task.id, parsed.data.id));

  if (result[0]) {
    return NextResponse.json(result[0]);
  }

  return NextResponse.json({
    error: {
      root: ["Cant find task"]
    }
  }, { status: 404 });
}

export type GetTaskResponse = InferResponseType<typeof POST>;
