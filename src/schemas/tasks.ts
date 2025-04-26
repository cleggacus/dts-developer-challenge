import { z } from "zod";

const dateTimeString = z.string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date-time string",
  });

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'complete']),
  due: dateTimeString,
});

export const deleteTaskSchema = z.object({
  id: z.string().uuid(),
});

export const getTaskSchema = z.object({
  id: z.string().uuid(),
});

export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'complete']).optional(),
  due: dateTimeString.optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type DeleteTaskSchema = z.infer<typeof deleteTaskSchema>;
export type GetTaskSchema = z.infer<typeof getTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
