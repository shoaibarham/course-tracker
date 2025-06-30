from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import os

app = FastAPI()

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for data validation
class Student(BaseModel):
    id: int
    student_id: str
    name: str
    email: str
    major: str
    specialization: str
    career_goal: str
    interest_keywords: List[str]
    term_preference: str
    filters_selected: Dict[str, Any]
    current_term: str
    cgpa: float

class Course(BaseModel):
    id: int
    code: str
    title: str
    description: Optional[str] = None
    credits: float = 0.5
    prerequisites: List[str] = []
    department: str
    ai_option_list: Optional[str] = None
    term_offered: List[str] = []
    difficulty_rating: float = 3.0
    
class StudentCourse(BaseModel):
    id: int
    student_id: int
    course_id: int
    grade: Optional[float] = None
    term: str
    status: str  # "completed", "current", "planned"

class CourseRecommendation(BaseModel):
    id: int
    student_id: int
    course_id: int
    match_score: float
    predicted_grade: Optional[float] = None
    reason: str

# In-memory storage (replace with database in production)
students_db = {}
courses_db = {}
student_courses_db = {}
recommendations_db = {}

# Initialize sample data
def initialize_data():
    # Sample student
    sample_student = Student(
        id=1,
        student_id="20123456",
        name="Sarah Chen",
        email="s.chen@uwaterloo.ca",
        major="Management Engineering",
        specialization="AI Option",
        career_goal="Data Scientist / ML Engineer",
        interest_keywords=["machine learning", "artificial intelligence", "optimization", "data science"],
        term_preference="Fall/Winter",
        filters_selected={"ai_option": True, "difficulty": "medium"},
        current_term="3B - Fall 2024",
        cgpa=3.67
    )
    students_db[1] = sample_student
    
    # Initialize courses from UW AI Option requirements
    ai_option_courses = [
        # List 1 - Society & Ethics
        Course(id=1, code="HIST212", title="The Computing Society", department="HIST", 
               ai_option_list="list1", term_offered=["Fall", "Winter"],
               description="Historical development of computing and its societal impact"),
        Course(id=2, code="MSE442", title="Impact of Information Systems on Organizations and Society", 
               department="MSE", ai_option_list="list1", term_offered=["Fall"],
               description="Analysis of information systems impact on organizations"),
        Course(id=3, code="STV208", title="Artificial Intelligence and Society: Impact, Ethics, and Equity", 
               department="STV", ai_option_list="list1", term_offered=["Fall", "Spring"],
               description="Ethical implications of AI in society"),
        
        # List 2 - Core AI/ML
        Course(id=4, code="CS480", title="Introduction to Machine Learning", department="CS",
               ai_option_list="list2", term_offered=["Fall", "Winter"], prerequisites=["CS370", "STAT230"],
               description="Fundamental machine learning algorithms and techniques"),
        Course(id=5, code="CS485", title="Statistical and Computational Foundations of Machine Learning",
               department="CS", ai_option_list="list2", term_offered=["Spring"], prerequisites=["CS370", "STAT230"],
               description="Advanced statistical methods for machine learning"),
        Course(id=6, code="CS486", title="Introduction to Artificial Intelligence", department="CS",
               ai_option_list="list2", term_offered=["Fall", "Spring"], prerequisites=["CS240", "CS341"],
               description="Core concepts in artificial intelligence"),
        Course(id=7, code="MSE446", title="Introduction to Machine Learning", department="MSE",
               ai_option_list="list2", term_offered=["Fall"], prerequisites=["MSCI240", "MSCI251"],
               description="Machine learning for management engineering applications"),
        
        # List 3 - Advanced/Specialized
        Course(id=8, code="SYDE577", title="Deep Learning", department="SYDE",
               ai_option_list="list3", term_offered=["Spring"], prerequisites=["CS485", "SYDE572"],
               description="Neural networks and deep learning architectures"),
        Course(id=9, code="STAT441", title="Statistical Learning - Classification", department="STAT",
               ai_option_list="list3", term_offered=["Winter"], prerequisites=["STAT240", "STAT331"],
               description="Statistical methods for classification problems"),
        Course(id=10, code="ECE457B", title="Fundamentals of Computational Intelligence", department="ECE",
               ai_option_list="list3", term_offered=["Winter"], prerequisites=["ECE204", "ECE207"],
               description="Computational intelligence algorithms and applications"),
    ]
    
    for course in ai_option_courses:
        courses_db[course.id] = course
    
    # Sample completed courses for the student
    completed_courses = [
        StudentCourse(id=1, student_id=1, course_id=3, grade=3.7, term="F2023", status="completed"),  # STV208
        StudentCourse(id=2, student_id=1, course_id=4, grade=4.0, term="W2024", status="completed"),  # CS480
        StudentCourse(id=3, student_id=1, course_id=6, grade=3.3, term="S2024", status="completed"),  # CS486
    ]
    
    for sc in completed_courses:
        student_courses_db[sc.id] = sc

# ML-based recommendation system
class RecommendationEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=100)
        
    def calculate_interest_match(self, student: Student, course: Course) -> float:
        """Calculate how well a course matches student interests using TF-IDF similarity"""
        student_text = " ".join(student.interest_keywords + [student.career_goal, student.specialization])
        course_text = f"{course.title} {course.description or ''} {course.department}"
        
        try:
            # Create TF-IDF vectors
            texts = [student_text, course_text]
            tfidf_matrix = self.vectorizer.fit_transform(texts)
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(similarity)
        except:
            # Fallback to keyword matching
            student_keywords = set(word.lower() for word in student.interest_keywords)
            course_keywords = set(word.lower() for word in (course.title + " " + (course.description or "")).split())
            overlap = len(student_keywords.intersection(course_keywords))
            return min(overlap / max(len(student_keywords), 1), 1.0)
    
    def predict_grade(self, student: Student, course: Course, completed_courses: List[StudentCourse]) -> float:
        """Predict student grade based on past performance and course difficulty"""
        if not completed_courses:
            return student.cgpa
        
        # Calculate average grade in similar courses
        similar_grades = []
        for sc in completed_courses:
            course_taken = courses_db.get(sc.course_id)
            if course_taken and course_taken.department == course.department:
                similar_grades.append(sc.grade)
        
        if similar_grades:
            dept_avg = np.mean(similar_grades)
            # Adjust for course difficulty
            difficulty_adjustment = (3.0 - course.difficulty_rating) * 0.1
            return min(max(float(dept_avg) + difficulty_adjustment, 0.0), 4.0)
        
        return student.cgpa
    
    def generate_recommendations(self, student_id: int) -> List[CourseRecommendation]:
        """Generate course recommendations for a student"""
        student = students_db.get(student_id)
        if not student:
            return []
        
        # Get completed courses
        completed_courses = [sc for sc in student_courses_db.values() if sc.student_id == student_id and sc.status == "completed"]
        completed_course_ids = {sc.course_id for sc in completed_courses}
        
        recommendations = []
        rec_id = len(recommendations_db) + 1
        
        for course in courses_db.values():
            if course.id in completed_course_ids:
                continue
            
            # Calculate match score
            interest_score = self.calculate_interest_match(student, course)
            
            # AI Option relevance boost
            ai_boost = 0.3 if course.ai_option_list else 0.0
            
            # Specialization alignment
            spec_boost = 0.2 if student.specialization.lower() in course.title.lower() or student.specialization.lower() in (course.description or "").lower() else 0.0
            
            # Prerequisites check
            prereq_penalty = 0.0
            completed_codes = {courses_db[sc.course_id].code for sc in completed_courses}
            missing_prereqs = [p for p in course.prerequisites if p not in completed_codes]
            if missing_prereqs:
                prereq_penalty = min(len(missing_prereqs) * 0.2, 0.6)
            
            match_score = min(max(interest_score + ai_boost + spec_boost - prereq_penalty, 0.0), 1.0)
            
            if match_score > 0.5:  # Only recommend courses with >50% match
                predicted_grade = self.predict_grade(student, course, completed_courses)
                
                # Generate reason
                reasons = []
                if interest_score > 0.3:
                    reasons.append("matches your interests")
                if course.ai_option_list:
                    reasons.append(f"counts toward AI Option {course.ai_option_list.replace('list', 'List ')}")
                if spec_boost > 0:
                    reasons.append("aligns with your specialization")
                if not missing_prereqs:
                    reasons.append("all prerequisites met")
                
                reason = "Recommended because it " + " and ".join(reasons) + f". Predicted grade: {predicted_grade:.1f}"
                
                recommendation = CourseRecommendation(
                    id=rec_id,
                    student_id=student_id,
                    course_id=course.id,
                    match_score=match_score,
                    predicted_grade=predicted_grade,
                    reason=reason
                )
                recommendations.append(recommendation)
                rec_id += 1
        
        # Sort by match score
        recommendations.sort(key=lambda x: x.match_score, reverse=True)
        return recommendations[:10]  # Top 10 recommendations

# Initialize recommendation engine
rec_engine = RecommendationEngine()

# API Routes
@app.get("/api/students/current", response_model=Student)
async def get_current_student():
    student = students_db.get(1)  # Demo student
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.put("/api/students/{student_id}", response_model=Student)
async def update_student(student_id: int, updates: dict):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Update student fields
    for key, value in updates.items():
        if hasattr(student, key):
            setattr(student, key, value)
    
    return student

@app.get("/api/courses", response_model=List[Course])
async def search_courses(
    query: str = "",
    department: str = "",
    ai_option_list: str = "",
    term_offered: str = ""
):
    courses = list(courses_db.values())
    
    if query:
        query_lower = query.lower()
        courses = [c for c in courses if query_lower in c.code.lower() or query_lower in c.title.lower()]
    
    if department:
        courses = [c for c in courses if c.department == department]
    
    if ai_option_list:
        courses = [c for c in courses if c.ai_option_list == ai_option_list]
    
    if term_offered:
        courses = [c for c in courses if term_offered in c.term_offered]
    
    return courses

@app.get("/api/students/{student_id}/recommendations")
async def get_recommendations(student_id: int):
    recommendations = rec_engine.generate_recommendations(student_id)
    
    # Convert to response format with course details
    result = []
    for rec in recommendations:
        course = courses_db[rec.course_id]
        result.append({
            "id": rec.id,
            "matchScore": rec.match_score,
            "predictedGrade": rec.predicted_grade,
            "reason": rec.reason,
            "course": course.dict()
        })
    
    return result

@app.get("/api/students/{student_id}/ai-option-progress")
async def get_ai_option_progress(student_id: int):
    completed_courses = [sc for sc in student_courses_db.values() 
                        if sc.student_id == student_id and sc.status == "completed"]
    
    list1_courses = []
    list2_courses = []
    list3_courses = []
    
    for sc in completed_courses:
        course = courses_db.get(sc.course_id)
        if course and course.ai_option_list:
            course_info = {
                "code": course.code,
                "title": course.title,
                "grade": sc.grade,
                "term": sc.term
            }
            if course.ai_option_list == "list1":
                list1_courses.append(course_info)
            elif course.ai_option_list == "list2":
                list2_courses.append(course_info)
            elif course.ai_option_list == "list3":
                list3_courses.append(course_info)
    
    return {
        "list1": {
            "completed": len(list1_courses),
            "required": 1,
            "courses": list1_courses
        },
        "list2": {
            "completed": len(list2_courses),
            "required": 2,
            "courses": list2_courses
        },
        "additional": {
            "completed": max(0, len(list2_courses) - 2) + len(list3_courses),
            "required": 3,
            "courses": list2_courses[2:] + list3_courses if len(list2_courses) > 2 else list3_courses
        },
        "totalCompleted": len(list1_courses) + len(list2_courses) + len(list3_courses),
        "totalRequired": 6
    }

@app.post("/api/students/{student_id}/courses")
async def add_student_course(student_id: int, course_data: dict):
    sc_id = len(student_courses_db) + 1
    student_course = StudentCourse(
        id=sc_id,
        student_id=student_id,
        course_id=course_data["courseId"],
        status=course_data.get("status", "planned"),
        term=course_data.get("term", "Spring 2025")
    )
    student_courses_db[sc_id] = student_course
    return {"success": True}

# Serve static files in production
if os.path.exists("dist/public"):
    app.mount("/", StaticFiles(directory="dist/public", html=True), name="static")

# Initialize data on startup
initialize_data()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000, reload=False)