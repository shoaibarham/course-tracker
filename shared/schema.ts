import { pgTable, text, serial, integer, boolean, real, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  student_id: text("student_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  major: text("major").notNull(),
  specialization: text("specialization").notNull(),
  career_goal: text("career_goal").notNull(),
  interest_keywords: json("interest_keywords").$type<string[]>().default([]),
  term_preference: text("term_preference").notNull(),
  filters_selected: json("filters_selected").$type<Record<string, any>>().default({}),
  current_term: text("current_term").notNull(),
  cgpa: real("cgpa").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  credits: real("credits").notNull().default(0.5),
  prerequisites: json("prerequisites").$type<string[]>().default([]),
  department: text("department").notNull(),
  aiOptionList: text("ai_option_list"), // "list1", "list2", "list3", or null
  isOffered: boolean("is_offered").default(true),
  termOffered: json("term_offered").$type<string[]>().default([]),
});

export const studentCourses = pgTable("student_courses", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  grade: real("grade"),
  term: text("term").notNull(),
  status: text("status").notNull().default("planned"), // "completed", "current", "planned"
});

export const courseRecommendations = pgTable("course_recommendations", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  matchScore: real("match_score").notNull(),
  predictedGrade: real("predicted_grade"),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

export const insertStudentCourseSchema = createInsertSchema(studentCourses).omit({
  id: true,
});

export const insertCourseRecommendationSchema = createInsertSchema(courseRecommendations).omit({
  id: true,
  createdAt: true,
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type StudentCourse = typeof studentCourses.$inferSelect;
export type InsertStudentCourse = z.infer<typeof insertStudentCourseSchema>;
export type CourseRecommendation = typeof courseRecommendations.$inferSelect;
export type InsertCourseRecommendation = z.infer<typeof insertCourseRecommendationSchema>;
