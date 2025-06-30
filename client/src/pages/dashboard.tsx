import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import AcademicProgress from "@/components/academic-progress";
import InterestSurvey from "@/components/interest-survey";
import CourseRecommendations from "@/components/course-recommendations";
import AIOptionTracker from "@/components/ai-option-tracker";
import CourseCatalog from "@/components/course-catalog";
import GraduationTimeline from "@/components/graduation-timeline";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, TriangleAlert, ClipboardList } from "lucide-react";

export default function Dashboard() {
  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ["/api/students/current"],
  });

  const { data: aiProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/students/1/ai-option-progress"],
    enabled: !!student,
  });

  if (studentLoading || progressLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-quest-blue"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">Student Not Found</h1>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Unable to load student data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header student={student} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Overview Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <AcademicProgress student={student} />
          
          {aiProgress && (
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">AI Option Progress</h3>
                  <i className="fas fa-robot text-green-600"></i>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Courses Completed</span>
                      <span>{aiProgress.totalCompleted}/{aiProgress.totalRequired}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(aiProgress.totalCompleted / aiProgress.totalRequired) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
                        aiProgress.list1.completed >= aiProgress.list1.required ? 'bg-green-600' : 'bg-yellow-400'
                      }`}></div>
                      <p>List 1: {aiProgress.list1.completed}/{aiProgress.list1.required}</p>
                    </div>
                    <div className="text-center">
                      <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
                        aiProgress.list2.completed >= aiProgress.list2.required ? 'bg-green-600' : 'bg-yellow-400'
                      }`}></div>
                      <p>List 2: {aiProgress.list2.completed}/{aiProgress.list2.required}</p>
                    </div>
                    <div className="text-center">
                      <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
                        aiProgress.additional.completed >= aiProgress.additional.required ? 'bg-green-600' : 'bg-yellow-400'
                      }`}></div>
                      <p>List 2/3: {aiProgress.additional.completed}/{aiProgress.additional.required}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Actions */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Next Actions</h3>
                <ClipboardList className="h-5 w-5 text-orange-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded-lg">
                  <TriangleAlert className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Course registration opens Jan 15</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Recommended actions:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Complete interest survey</li>
                    <li>• Review AI Option requirements</li>
                    <li>• Schedule advisor meeting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interest Survey */}
        <InterestSurvey student={student} />

        {/* Course Recommendations and AI Option Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CourseRecommendations studentId={student.id} />
          <AIOptionTracker studentId={student.id} />
        </div>

        {/* Course Catalog */}
        <CourseCatalog />

        {/* Graduation Timeline */}
        <GraduationTimeline student={student} />
      </div>
    </div>
  );
}
