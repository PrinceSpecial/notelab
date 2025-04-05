import { pgTable, varchar, text, timestamp, serial } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const notes = pgTable("notes", {
  id: text("id").primaryKey().$defaultFn(createId),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
