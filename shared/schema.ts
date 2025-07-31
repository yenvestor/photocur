import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, json, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  userId: varchar("user_id").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  layers: json("layers").notNull().default([]),
  settings: json("settings").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectHistory = pgTable("project_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  action: text("action").notNull(),
  data: json("data").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  userId: true,
  width: true,
  height: true,
  layers: true,
  settings: true,
});

export const insertHistorySchema = createInsertSchema(projectHistory).pick({
  projectId: true,
  action: true,
  data: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type ProjectHistory = typeof projectHistory.$inferSelect;
