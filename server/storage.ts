import { 
  students, 
  courses, 
  studentCourses, 
  courseRecommendations,
  type Student, 
  type InsertStudent,
  type Course,
  type InsertCourse,
  type StudentCourse,
  type InsertStudentCourse,
  type CourseRecommendation,
  type InsertCourseRecommendation
} from "@shared/schema";

export interface IStorage {
  // Student methods
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByStudentId(studentId: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, updates: Partial<InsertStudent>): Promise<Student | undefined>;

  // Course methods
  getCourse(id: number): Promise<Course | undefined>;
  getCourseByCode(code: string): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  searchCourses(query: string, filters?: {
    department?: string;
    aiOptionList?: string;
    termOffered?: string;
  }): Promise<Course[]>;

  // Student course methods
  getStudentCourses(studentId: number): Promise<(StudentCourse & { course: Course })[]>;
  addStudentCourse(studentCourse: InsertStudentCourse): Promise<StudentCourse>;
  updateStudentCourse(id: number, updates: Partial<InsertStudentCourse>): Promise<StudentCourse | undefined>;

  // Recommendation methods
  getRecommendationsForStudent(studentId: number): Promise<(CourseRecommendation & { course: Course })[]>;
  createRecommendation(recommendation: InsertCourseRecommendation): Promise<CourseRecommendation>;
  updateRecommendations(studentId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private students: Map<number, Student> = new Map();
  private courses: Map<number, Course> = new Map();
  private studentCourses: Map<number, StudentCourse> = new Map();
  private recommendations: Map<number, CourseRecommendation> = new Map();
  private currentStudentId = 1;
  private currentCourseId = 1;
  private currentStudentCourseId = 1;
  private currentRecommendationId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create sample student
    const sampleStudent: Student = {
      id: 1,
      name: "Sarah Chen",
      studentId: "20123456",
      email: "s.chen@uwaterloo.ca",
      program: "Management Engineering",
      currentTerm: "3B - Fall 2024",
      cgpa: 3.67,
      interests: ["Machine Learning & AI", "Optimization & Operations Research"],
      careerPath: "Data Scientist / ML Engineer",
      learningStyle: "Hands-on projects & coding",
      createdAt: new Date(),
    };
    this.students.set(1, sampleStudent);
    this.currentStudentId = 2;

    // Initialize courses from UW curriculum
    this.initializeCourses();
    this.initializeStudentCourses();
  }

  private initializeCourses() {
    const coursesData: InsertCourse[] = [
      // List 1 - Society & Ethics
      { code: "HIST212", title: "The Computing Society", credits: 0.5, department: "HIST", aiOptionList: "list1", prerequisites: [], termOffered: ["Fall", "Winter"] },
      { code: "MSE442", title: "Impact of Information Systems on Organizations and Society", credits: 0.5, department: "MSE", aiOptionList: "list1", prerequisites: [], termOffered: ["Fall"] },
      { code: "STV205", title: "Cybernetics and Society", credits: 0.5, department: "STV", aiOptionList: "list1", prerequisites: [], termOffered: ["Winter"] },
      { code: "STV208", title: "Artificial Intelligence and Society: Impact, Ethics, and Equity", credits: 0.5, department: "STV", aiOptionList: "list1", prerequisites: [], termOffered: ["Fall", "Spring"] },
      { code: "STV210", title: "The Computing Society", credits: 0.5, department: "STV", aiOptionList: "list1", prerequisites: [], termOffered: ["Winter"] },
      { code: "STV302", title: "Information Technology and Society", credits: 0.5, department: "STV", aiOptionList: "list1", prerequisites: [], termOffered: ["Spring"] },

      // List 2 - Core AI/ML
      { code: "CS480", title: "Introduction to Machine Learning", credits: 0.5, department: "CS", aiOptionList: "list2", prerequisites: ["CS370", "STAT230"], termOffered: ["Fall", "Winter"] },
      { code: "CS485", title: "Statistical and Computational Foundations of Machine Learning", credits: 0.5, department: "CS", aiOptionList: "list2", prerequisites: ["CS370", "STAT230"], termOffered: ["Spring"] },
      { code: "CS486", title: "Introduction to Artificial Intelligence", credits: 0.5, department: "CS", aiOptionList: "list2", prerequisites: ["CS240", "CS341"], termOffered: ["Fall", "Spring"] },
      { code: "ECE457A", title: "Co-operative and Adaptive Algorithms", credits: 0.5, department: "ECE", aiOptionList: "list2", prerequisites: ["ECE204", "ECE207"], termOffered: ["Fall"] },
      { code: "ECE457B", title: "Fundamentals of Computational Intelligence", credits: 0.5, department: "ECE", aiOptionList: "list2", prerequisites: ["ECE204", "ECE207"], termOffered: ["Winter"] },
      { code: "ECE457C", title: "Reinforcement Learning", credits: 0.5, department: "ECE", aiOptionList: "list2", prerequisites: ["ECE457A"], termOffered: ["Spring"] },
      { code: "MSE435", title: "Advanced Optimization Techniques", credits: 0.5, department: "MSE", aiOptionList: "list2", prerequisites: ["MSCI331"], termOffered: ["Winter"] },
      { code: "MSE446", title: "Introduction to Machine Learning", credits: 0.5, department: "MSE", aiOptionList: "list2", prerequisites: ["MSCI240", "MSCI251"], termOffered: ["Fall"] },
      { code: "SYDE522", title: "Foundations of Artificial Intelligence", credits: 0.5, department: "SYDE", aiOptionList: "list2", prerequisites: ["SYDE113"], termOffered: ["Fall"] },

      // List 3 - Advanced/Specialized
      { code: "AMATH449", title: "Neural Networks", credits: 0.5, department: "AMATH", aiOptionList: "list3", prerequisites: ["AMATH331", "MATH213"], termOffered: ["Winter"] },
      { code: "BIOL487", title: "Computational Neuroscience", credits: 0.5, department: "BIOL", aiOptionList: "list3", prerequisites: ["BIOL240"], termOffered: ["Spring"] },
      { code: "CHE521", title: "Process Optimization", credits: 0.5, department: "CHE", aiOptionList: "list3", prerequisites: ["CHE102"], termOffered: ["Fall"] },
      { code: "CO367", title: "Nonlinear Optimization", credits: 0.5, department: "CO", aiOptionList: "list3", prerequisites: ["MATH235"], termOffered: ["Winter"] },
      { code: "CO456", title: "Introduction to Game Theory", credits: 0.5, department: "CO", aiOptionList: "list3", prerequisites: ["MATH235"], termOffered: ["Fall"] },
      { code: "CO463", title: "Convex Optimization and Analysis", credits: 0.5, department: "CO", aiOptionList: "list3", prerequisites: ["MATH235", "MATH237"], termOffered: ["Spring"] },
      { code: "CS452", title: "Real-Time Programming", credits: 0.5, department: "CS", aiOptionList: "list3", prerequisites: ["CS350"], termOffered: ["Winter"] },
      { code: "CS479", title: "Neural Networks", credits: 0.5, department: "CS", aiOptionList: "list3", prerequisites: ["CS370"], termOffered: ["Winter"] },
      { code: "CS484", title: "Computational Vision", credits: 0.5, department: "CS", aiOptionList: "list3", prerequisites: ["CS370"], termOffered: ["Fall"] },
      { code: "STAT341", title: "Computational Statistics and Data Analysis", credits: 0.5, department: "STAT", aiOptionList: "list3", prerequisites: ["STAT240"], termOffered: ["Fall", "Spring"] },
      { code: "STAT441", title: "Statistical Learning - Classification", credits: 0.5, department: "STAT", aiOptionList: "list3", prerequisites: ["STAT240", "STAT331"], termOffered: ["Winter"] },
      { code: "STAT444", title: "Statistical Learning - Advanced Regression", credits: 0.5, department: "STAT", aiOptionList: "list3", prerequisites: ["STAT341"], termOffered: ["Spring"] },
      { code: "SYDE552", title: "Computational Neuroscience", credits: 0.5, department: "SYDE", aiOptionList: "list3", prerequisites: ["SYDE113"], termOffered: ["Winter"] },
      { code: "SYDE572", title: "Introduction to Pattern Recognition", credits: 0.5, department: "SYDE", aiOptionList: "list3", prerequisites: ["SYDE113"], termOffered: ["Fall"] },
      { code: "SYDE577", title: "Deep Learning", credits: 0.5, department: "SYDE", aiOptionList: "list3", prerequisites: ["CS485", "SYDE572"], termOffered: ["Spring"] },
    ];

    coursesData.forEach((courseData, index) => {
      const course: Course = { id: index + 1, ...courseData };
      this.courses.set(course.id, course);
    });
    this.currentCourseId = coursesData.length + 1;
  }

  private initializeStudentCourses() {
    // Sample completed courses for Sarah Chen
    const completedCourses = [
      { courseCode: "STV208", grade: 3.7, term: "F2023" },
      { courseCode: "CS480", grade: 4.0, term: "W2024" },
      { courseCode: "CS486", grade: 3.3, term: "S2024" },
    ];

    completedCourses.forEach((completed, index) => {
      const course = Array.from(this.courses.values()).find(c => c.code === completed.courseCode);
      if (course) {
        const studentCourse: StudentCourse = {
          id: index + 1,
          studentId: 1,
          courseId: course.id,
          grade: completed.grade,
          term: completed.term,
          status: "completed",
        };
        this.studentCourses.set(studentCourse.id, studentCourse);
      }
    });
    this.currentStudentCourseId = completedCourses.length + 1;
  }

  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByStudentId(studentId: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(s => s.studentId === studentId);
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const newStudent: Student = {
      ...student,
      id: this.currentStudentId++,
      createdAt: new Date(),
    };
    this.students.set(newStudent.id, newStudent);
    return newStudent;
  }

  async updateStudent(id: number, updates: Partial<InsertStudent>): Promise<Student | undefined> {
    const existing = this.students.get(id);
    if (!existing) return undefined;
    
    const updated: Student = { ...existing, ...updates };
    this.students.set(id, updated);
    return updated;
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCourseByCode(code: string): Promise<Course | undefined> {
    return Array.from(this.courses.values()).find(c => c.code === code);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: this.currentCourseId++,
    };
    this.courses.set(newCourse.id, newCourse);
    return newCourse;
  }

  async searchCourses(query: string, filters?: {
    department?: string;
    aiOptionList?: string;
    termOffered?: string;
  }): Promise<Course[]> {
    let courses = Array.from(this.courses.values());
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      courses = courses.filter(c => 
        c.code.toLowerCase().includes(lowerQuery) ||
        c.title.toLowerCase().includes(lowerQuery)
      );
    }

    if (filters?.department) {
      courses = courses.filter(c => c.department === filters.department);
    }

    if (filters?.aiOptionList) {
      courses = courses.filter(c => c.aiOptionList === filters.aiOptionList);
    }

    if (filters?.termOffered) {
      courses = courses.filter(c => c.termOffered.includes(filters.termOffered!));
    }

    return courses;
  }

  async getStudentCourses(studentId: number): Promise<(StudentCourse & { course: Course })[]> {
    const studentCoursesList = Array.from(this.studentCourses.values())
      .filter(sc => sc.studentId === studentId);
    
    return studentCoursesList.map(sc => {
      const course = this.courses.get(sc.courseId)!;
      return { ...sc, course };
    });
  }

  async addStudentCourse(studentCourse: InsertStudentCourse): Promise<StudentCourse> {
    const newStudentCourse: StudentCourse = {
      ...studentCourse,
      id: this.currentStudentCourseId++,
    };
    this.studentCourses.set(newStudentCourse.id, newStudentCourse);
    return newStudentCourse;
  }

  async updateStudentCourse(id: number, updates: Partial<InsertStudentCourse>): Promise<StudentCourse | undefined> {
    const existing = this.studentCourses.get(id);
    if (!existing) return undefined;
    
    const updated: StudentCourse = { ...existing, ...updates };
    this.studentCourses.set(id, updated);
    return updated;
  }

  async getRecommendationsForStudent(studentId: number): Promise<(CourseRecommendation & { course: Course })[]> {
    const studentRecommendations = Array.from(this.recommendations.values())
      .filter(r => r.studentId === studentId);
    
    return studentRecommendations.map(r => {
      const course = this.courses.get(r.courseId)!;
      return { ...r, course };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  async createRecommendation(recommendation: InsertCourseRecommendation): Promise<CourseRecommendation> {
    const newRecommendation: CourseRecommendation = {
      ...recommendation,
      id: this.currentRecommendationId++,
      createdAt: new Date(),
    };
    this.recommendations.set(newRecommendation.id, newRecommendation);
    return newRecommendation;
  }

  async updateRecommendations(studentId: number): Promise<void> {
    // Clear existing recommendations for this student
    const existingRecs = Array.from(this.recommendations.entries())
      .filter(([, rec]) => rec.studentId === studentId);
    existingRecs.forEach(([id]) => this.recommendations.delete(id));

    // Get student data
    const student = await this.getStudent(studentId);
    if (!student) return;

    const studentCourses = await this.getStudentCourses(studentId);
    const completedCourseIds = new Set(
      studentCourses
        .filter(sc => sc.status === "completed")
        .map(sc => sc.courseId)
    );

    // Generate new recommendations
    const allCourses = await this.getAllCourses();
    const availableCourses = allCourses.filter(c => !completedCourseIds.has(c.id));

    for (const course of availableCourses) {
      const matchScore = this.calculateMatchScore(student, course, studentCourses);
      const predictedGrade = this.predictGrade(student, course, studentCourses);
      const reason = this.generateReason(student, course, studentCourses);

      if (matchScore > 0.5) { // Only recommend courses with >50% match
        await this.createRecommendation({
          studentId,
          courseId: course.id,
          matchScore,
          predictedGrade,
          reason,
        });
      }
    }
  }

  private calculateMatchScore(student: Student, course: Course, studentCourses: (StudentCourse & { course: Course })[]): number {
    let score = 0.5; // Base score

    // Interest matching
    if (student.interests.includes("Machine Learning & AI") && 
        (course.code.startsWith("CS4") || course.code.startsWith("SYDE5") || course.title.toLowerCase().includes("machine learning"))) {
      score += 0.3;
    }

    if (student.interests.includes("Optimization & Operations Research") && 
        (course.code.startsWith("CO") || course.title.toLowerCase().includes("optimization"))) {
      score += 0.25;
    }

    // AI Option relevance
    if (course.aiOptionList) {
      score += 0.2;
    }

    // Prerequisites check (reduce score if missing prerequisites)
    const completedCodes = new Set(studentCourses.filter(sc => sc.status === "completed").map(sc => sc.course.code));
    const missingPrereqs = course.prerequisites.filter(prereq => !completedCodes.has(prereq));
    if (missingPrereqs.length > 0) {
      score -= 0.3 * missingPrereqs.length;
    }

    return Math.max(0, Math.min(1, score));
  }

  private predictGrade(student: Student, course: Course, studentCourses: (StudentCourse & { course: Course })[]): number {
    const baseGrade = student.cgpa;
    let adjustment = 0;

    // Adjust based on related course performance
    const relatedCourses = studentCourses.filter(sc => 
      sc.status === "completed" && 
      sc.course.department === course.department
    );

    if (relatedCourses.length > 0) {
      const avgRelatedGrade = relatedCourses.reduce((sum, sc) => sum + (sc.grade || 0), 0) / relatedCourses.length;
      adjustment = (avgRelatedGrade - baseGrade) * 0.5;
    }

    return Math.max(0, Math.min(4.0, baseGrade + adjustment));
  }

  private generateReason(student: Student, course: Course, studentCourses: (StudentCourse & { course: Course })[]): string {
    const reasons = [];

    if (student.interests.includes("Machine Learning & AI") && course.title.toLowerCase().includes("machine learning")) {
      reasons.push("Strong match with your ML interests");
    }

    const relatedCompleted = studentCourses.find(sc => 
      sc.status === "completed" && 
      sc.course.department === course.department &&
      sc.grade && sc.grade >= 3.5
    );

    if (relatedCompleted) {
      reasons.push(`Good performance in ${relatedCompleted.course.code} (${relatedCompleted.grade?.toFixed(1)})`);
    }

    if (course.aiOptionList) {
      reasons.push(`Required for AI Option (${course.aiOptionList.toUpperCase()})`);
    }

    return reasons.join(". ") || "Good fit for your academic profile";
  }
}

export const storage = new MemStorage();
