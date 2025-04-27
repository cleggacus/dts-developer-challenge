/**
 * @jest-environment node
 */

import { POST } from "../create/route";
// import { db } from '@/db';
import { NextRequest } from "next/server";

jest.mock("@/db", () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

// const mockedDB = db as any as ({
//   insert: jest.Mock<any, any, any>;
//   values: jest.Mock<any, any, any>;
//   returning: jest.Mock<any, any, any>;
// });

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

    console.log(json);

    expect(res.status).toBe(400);
    expect(json).toEqual({
      error: {
        title: ["title is required"],
        status: ["status must be not_started, in_progress, or complete"],
        due: ["invalid date-time string"],
      },
    });
  });
});
