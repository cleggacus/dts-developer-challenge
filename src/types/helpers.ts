import { NextRequest, NextResponse } from "next/server";

export type RouteFn<T> = (req: NextRequest) => Promise<NextResponse<T>>;

export type InferResponseType<T extends RouteFn<object>> =
  T extends RouteFn<infer U> ? U : never;
