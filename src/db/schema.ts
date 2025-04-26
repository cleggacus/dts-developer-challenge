import { text, timestamp, pgTable, uuid, pgEnum } from "drizzle-orm/pg-core";

export const statusEnumValues = ['not_started', 'in_progress', 'complete'] as const;
export type StatusEnum = typeof statusEnumValues[number];
export const statusEnum = pgEnum('status', statusEnumValues);

export const task = pgTable("task", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: statusEnum("status").notNull().default("not_started"),
  due: timestamp('due').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});
