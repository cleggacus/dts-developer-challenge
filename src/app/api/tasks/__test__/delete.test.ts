/**
 * @jest-environment node
 */

import { DELETE } from "../delete/route";
import { db } from "@/db";
import { task } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

jest.mock("@/db", () => ({
  db: {
    delete: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

const mockedDB = db as any as {
  delete: jest.Mock<any, any, any>;
  where: jest.Mock<any, any, any>;
  returning: jest.Mock<any, any, any>;
};

describe("DELETE /api/tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fail on zod validation", async () => {
    const body = {};

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await DELETE(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: { id: ["Required"] } });
  });

  it("should delete a task successfully", async () => {
    const body = { id: "1" };

    mockedDB.returning.mockResolvedValueOnce([
      {
        id: "1",
        title: "Test Task",
        description: "Test task for deletion",
        status: "not_started",
        due: new Date().toISOString(),
      },
    ]);

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await DELETE(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toMatchObject({
      id: "1",
      title: "Test Task",
      description: "Test task for deletion",
    });
    expect(mockedDB.delete).toHaveBeenCalled();
    expect(mockedDB.where).toHaveBeenCalledWith(eq(task.id, body.id));
    expect(mockedDB.returning).toHaveBeenCalled();
  });

  it("should return 404 if task is not found", async () => {
    const body = { id: "999" };
    mockedDB.returning.mockResolvedValueOnce([]);

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await DELETE(req);
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

    const body = { id: "1" };

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await DELETE(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      error: {
        root: ["Server error"],
      },
    });
  });
});
