import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertCourseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Student routes
  app.get("/api/students/current", async (req, res) => {
    try {
      // For demo, return the sample student
      const student = await storage.getStudentByStudentId("20123456");
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const updated = await storage.updateStudent(id, updateData);
      if (!updated) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      // Update recommendations when student profile changes
      await storage.updateRecommendations(id);
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const { query, department, aiOptionList, termOffered } = req.query;
      
      const courses = await storage.searchCourses(
        query as string || "",
        {
          department: department as string,
          aiOptionList: aiOptionList as string,
          termOffered: termOffered as string,
        }
      );
      
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/courses/:code", async (req, res) => {
    try {
      const course = await storage.getCourseByCode(req.params.code);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Student courses routes
  app.get("/api/students/:id/courses", async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const studentCourses = await storage.getStudentCourses(studentId);
      res.json(studentCourses);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/students/:id/courses", async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const { courseId, status = "planned", term } = req.body;
      
      const studentCourse = await storage.addStudentCourse({
        studentId,
        courseId,
        status,
        term,
      });
      
      res.json(studentCourse);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Recommendations routes
  app.get("/api/students/:id/recommendations", async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const recommendations = await storage.getRecommendationsForStudent(studentId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/students/:id/recommendations/update", async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      await storage.updateRecommendations(studentId);
      const recommendations = await storage.getRecommendationsForStudent(studentId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI Option progress route
  app.get("/api/students/:id/ai-option-progress", async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const studentCourses = await storage.getStudentCourses(studentId);
      
      const completedCourses = studentCourses.filter(sc => sc.status === "completed");
      
      const list1Completed = completedCourses.filter(sc => sc.course.aiOptionList === "list1");
      const list2Completed = completedCourses.filter(sc => sc.course.aiOptionList === "list2");
      const list3Completed = completedCourses.filter(sc => sc.course.aiOptionList === "list3");
      
      const progress = {
        list1: {
          completed: list1Completed.length,
          required: 1,
          courses: list1Completed.map(sc => ({
            code: sc.course.code,
            title: sc.course.title,
            grade: sc.grade,
            term: sc.term,
          })),
        },
        list2: {
          completed: list2Completed.length,
          required: 2,
          courses: list2Completed.map(sc => ({
            code: sc.course.code,
            title: sc.course.title,
            grade: sc.grade,
            term: sc.term,
          })),
        },
        additional: {
          completed: Math.max(0, list2Completed.length - 2) + list3Completed.length,
          required: 3,
          courses: [
            ...list2Completed.slice(2).map(sc => ({
              code: sc.course.code,
              title: sc.course.title,
              grade: sc.grade,
              term: sc.term,
            })),
            ...list3Completed.map(sc => ({
              code: sc.course.code,
              title: sc.course.title,
              grade: sc.grade,
              term: sc.term,
            })),
          ],
        },
        totalCompleted: list1Completed.length + list2Completed.length + list3Completed.length,
        totalRequired: 6,
      };
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
