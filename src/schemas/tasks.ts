import { z } from "zod";

const dateTimeString = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "invalid date-time string",
});

const titleString = z.string().min(1, { message: "title is required" });
const statusEnum = z.enum(["not_started", "in_progress", "complete"], {
  message: "status must be not_started, in_progress, or complete",
});

export const createTaskSchema = z.object({
  title: titleString,
  description: z.string().optional(),
  status: statusEnum,
  due: dateTimeString,
});

export const deleteTaskSchema = z.object({
  id: z.string(),
});

export const getTaskSchema = z.object({
  id: z.string(),
});

export const updateTaskSchema = z.object({
  id: z.string(),
  title: titleString.optional(),
  description: z.string().optional(),
  status: statusEnum.optional(),
  due: dateTimeString.optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type DeleteTaskSchema = z.infer<typeof deleteTaskSchema>;
export type GetTaskSchema = z.infer<typeof getTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
