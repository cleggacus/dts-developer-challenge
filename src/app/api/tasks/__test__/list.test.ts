/**
 * @jest-environment node
 */

import { GET } from "../list/route";
import { db } from "@/db";
import { task } from "@/db/schema";

jest.mock("@/db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn(),
  },
}));

const mockedDB = db as any as {
  select: jest.Mock<any, any, any>;
  from: jest.Mock<any, any, any>;
};

describe("GET /api/tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return list of tasks successfully", async () => {
    const mockTasks = [
      {
        id: "1",
        title: "Task 1",
        description: "Description 1",
        status: "not_started",
        due: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Task 2",
        description: "Description 2",
        status: "in_progress",
        due: new Date().toISOString(),
      },
    ];

    mockedDB.from.mockReturnValueOnce(mockTasks);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockTasks);
    expect(mockedDB.from).toHaveBeenCalledWith(task);
  });

  it("should return 500 if an error is thrown", async () => {
    mockedDB.from.mockRejectedValueOnce(new Error("Database down"));

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      error: {
        root: ["Server error"],
      },
    });
  });
});
