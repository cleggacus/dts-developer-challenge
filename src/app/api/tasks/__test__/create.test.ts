/**
 * @jest-environment node
 */

import { POST } from "../create/route";
import { db } from '@/db';
import { NextRequest } from "next/server";

jest.mock("@/db", () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

const mockedDB = db as any as ({
  insert: jest.Mock<any, any, any>;
  values: jest.Mock<any, any, any>;
  returning: jest.Mock<any, any, any>;
});

describe("POST /api/tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fail on the zod validation", async () => {
    const body = {
      title: "",
      description: "yes yes",
      status: "fake",
      due: "fake",
    };

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
    expect(json).toEqual({
      error: {
        title: ["title is required"],
        status: ["status must be not_started, in_progress, or complete"],
        due: ["invalid date-time string"],
      },
    });
  });

  it("should create a task successfully", async () => {
    const body = {
      title: "Test Task",
      description: "Testing creation",
      status: "not_started",
      due: new Date().toISOString(),
    };

    mockedDB.returning.mockResolvedValueOnce([
      {
        id: 1,
        title: body.title,
        description: body.description,
        status: body.status,
        due: new Date(body.due),
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

    expect(res.status).toBe(201);
    expect(json).toMatchObject({
      id: 1,
      title: "Test Task",
      description: "Testing creation",
      status: "not_started",
    });
    expect(mockedDB.insert).toHaveBeenCalled();
    expect(mockedDB.values).toHaveBeenCalledWith({
      title: body.title,
      description: body.description,
      status: body.status,
      due: expect.any(Date),
    });
    expect(mockedDB.returning).toHaveBeenCalled();
  });

  it("should return 500 if an error is thrown", async () => {
    mockedDB.returning.mockRejectedValueOnce(new Error("Database down"));

    const body = {
      title: "Test Task",
      description: "Testing error",
      status: "not_started",
      due: new Date().toISOString(),
    };

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
