/**
 * @jest-environment node
 */

import { PUT } from "../update/route";
import { db } from "@/db";
import { task } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

jest.mock("@/db", () => ({
  db: {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

const mockedDB = db as any as {
  update: jest.Mock<any, any, any>;
  set: jest.Mock<any, any, any>;
  where: jest.Mock<any, any, any>;
  returning: jest.Mock<any, any, any>;
};

describe("PUT /api/tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fail on zod validation", async () => {
    const body = {
      title: "Updated Task",
      description: "Updated description",
      status: "in_progress",
      due: new Date().toISOString(),
    };

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      error: {
        id: ["Required"],
      },
    });
  });

  it("should update a task successfully", async () => {
    const body = {
      id: "1",
      title: "Updated Task",
      description: "Updated description",
      status: "in_progress",
      due: new Date().toISOString(),
    };

    mockedDB.returning.mockResolvedValueOnce([
      {
        id: "1",
        title: "Updated Task",
        description: "Updated description",
        status: "in_progress",
        due: new Date(body.due),
      },
    ]);

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toMatchObject({
      id: "1",
      title: "Updated Task",
      description: "Updated description",
      status: "in_progress",
    });
    expect(mockedDB.update).toHaveBeenCalled();
    expect(mockedDB.set).toHaveBeenCalled();
    expect(mockedDB.where).toHaveBeenCalledWith(eq(task.id, body.id));
    expect(mockedDB.returning).toHaveBeenCalled();
  });

  it("should return 404 if task is not found", async () => {
    const body = {
      id: "999",
      title: "Non-existent Task",
      status: "not_started",
    };

    mockedDB.returning.mockResolvedValueOnce([]);

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({
      error: {
        root: ["Cant find task"],
      },
    });
  });

  it("should return 500 if an error is thrown", async () => {
    mockedDB.returning.mockRejectedValueOnce(new Error("Database down"));

    const body = { id: "1", title: "Test Task", status: "not_started" };

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      error: {
        root: ["Server error"],
      },
    });
  });
});
