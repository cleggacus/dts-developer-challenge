/**
 * @jest-environment node
 */

import { POST } from "../get/route";
import { db } from '@/db';
import { task } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

jest.mock("@/db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

const mockedDB = db as any as ({
  select: jest.Mock<any, any, any>;
  from: jest.Mock<any, any, any>;
  where: jest.Mock<any, any, any>;
  returning: jest.Mock<any, any, any>;
});

describe("GET /api/tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fail on zod validation", async () => {
    const body = {};

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: { id: ['Required'] } });
  });

  it("should return task details successfully", async () => {
    const body = { id: "1" };

    mockedDB.where.mockResolvedValueOnce([
      {
        id: "1",
        title: "Test Task",
        description: "Test task for retrieval",
        status: "not_started",
        due: new Date().toISOString(),
      },
    ]);

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toMatchObject({
      id: "1",
      title: "Test Task",
      description: "Test task for retrieval",
    });
    expect(mockedDB.select).toHaveBeenCalled();
    expect(mockedDB.where).toHaveBeenCalledWith(eq(task.id, body.id));
  });

  it("should return 404 if task is not found", async () => {
    const body = { id: "999" };

    mockedDB.returning.mockResolvedValueOnce([]);

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({
      error: {
        root: ["Cant find task"],
      },
    });
  });

  it("should return 500 if an error is thrown", async () => {
    mockedDB.where.mockRejectedValueOnce(new Error("Database down"));

    const body = { id: "1" };

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      error: {
        root: ["Server error"],
      },
    });
  });
});
