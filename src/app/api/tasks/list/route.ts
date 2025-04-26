import { db } from '@/db';
import { task } from '@/db/schema';
import { InferResponseType } from '@/types/helpers';
import { NextResponse } from 'next/server';

export async function GET() {
  const tasks = await db.select().from(task);
  return NextResponse.json(tasks);
}

export type ListTaskResponse = InferResponseType<typeof GET>;
