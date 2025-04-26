import { NextResponse } from "next/server";

export type RouteFn<T> = (...args: any[]) => Promise<NextResponse<T>>;

export type InferResponseType<T extends RouteFn<any>> =
  T extends RouteFn<infer U> ? U : never;
