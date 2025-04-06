import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const notes = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey().$defaultFn(createId),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  lastUpdatedBy: varchar("last_updated_by", { length: 255 }).notNull(),
});
