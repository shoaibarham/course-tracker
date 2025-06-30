import { pgTable, text, serial, integer, boolean, real, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  studentId: text("student_id").notNull().unique(),
  email: text("email").notNull(),
  program: text("program").notNull().default("Management Engineering"),
  currentTerm: text("current_term").notNull(),
  cgpa: real("cgpa").notNull(),
  interests: json("interests").$type<string[]>().default([]),
  careerPath: text("career_path"),
  learningStyle: text("learning_style"),
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
